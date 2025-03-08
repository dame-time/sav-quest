import logging
from typing import Any, Dict, List, Optional

from app.api import deps
from app.services.pdf_analysis import DEFAULT_MODEL, process_pdf_statements
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_statements(
    files: List[UploadFile] = File(...),
    model: Optional[str] = Query(
        DEFAULT_MODEL,
        description="The LLM model to use for analysis (e.g., gpt-4o, gpt-3.5-turbo)",
    ),
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    """
    Analyze PDF bank statements and return insights.

    This endpoint:
    1. Accepts multiple PDF files
    2. Extracts text from the PDFs
    3. Analyzes the text using an LLM
    4. Returns financial insights, trait scores, and XP earned

    Parameters:
    - files: List of PDF files to analyze
    - model: The LLM model to use (default: gpt-4o)
    """
    try:
        # Validate file types
        for file in files:
            content_type = file.content_type
            if content_type != "application/pdf":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File {file.filename} is not a PDF. Only PDF files are accepted.",
                )

        # Validate model
        allowed_models = ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"]
        if model not in allowed_models:
            logger.warning(
                f"Invalid model requested: {model}. Using default model {DEFAULT_MODEL} instead."
            )
            model = DEFAULT_MODEL

        # Process the PDF files with the specified model
        logger.info(f"Processing PDF statements with model: {model}")
        result = process_pdf_statements(files, model=model)

        # In a production app, you would save the analysis results and update user traits/XP in the database
        # For example:
        # user_service.update_user_traits(current_user.id, result["traits"])
        # user_service.add_user_xp(current_user.id, result["xpEarned"])

        return result

    except ValueError as e:
        logger.error(f"Value error in statement analysis: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error in statement analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while analyzing the statements",
        )
