import json
import logging
import os
from typing import Any, Dict, List, Optional, Tuple

import tiktoken
from openai import OpenAI
from pypdf import PdfReader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

# Initialize DeepSeek client if available
deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
use_deepseek = deepseek_api_key is not None

# Default model to use
DEFAULT_MODEL = os.getenv(
    "OPENAI_DEFAULT_MODEL", "gpt-4o"
)  # Get from env or default to gpt-4o
logger.info(f"Using default model: {DEFAULT_MODEL}")


# Token counting for OpenAI models
def num_tokens_from_string(string: str, model: str = DEFAULT_MODEL) -> int:
    """Returns the number of tokens in a text string."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(string))


def extract_text_from_pdf(pdf_file) -> str:
    """Extract text from a PDF file."""
    try:
        # For FastAPI UploadFile objects, we need to read the content first
        if hasattr(pdf_file, "file"):
            # This is a FastAPI UploadFile
            content = pdf_file.file.read()
            # Create a BytesIO object from the content
            from io import BytesIO

            pdf_bytes = BytesIO(content)
            reader = PdfReader(pdf_bytes)
        else:
            # Regular file object
            reader = PdfReader(pdf_file)

        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        # Reset the file pointer for potential reuse
        if hasattr(pdf_file, "file"):
            pdf_file.file.seek(0)

        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        raise ValueError(f"Failed to extract text from PDF: {e}")


def analyze_statement_with_llm(text: str, model: str = DEFAULT_MODEL) -> Dict[str, Any]:
    """
    Analyze bank statement text using an LLM (OpenAI or DeepSeek).

    Returns a dictionary with analysis results including:
    - totalIncome: float
    - totalExpenses: float
    - savingsRate: float
    - topCategories: List[Dict[str, Any]]
    - recommendations: List[str]
    - traits: Dict[str, int]
    - xpEarned: int
    """
    # Check if text is too long and truncate if necessary
    token_count = num_tokens_from_string(text, model)

    # Set max tokens based on model
    if model == "gpt-4o" or model == "gpt-4-turbo":
        max_tokens = 100000  # Higher limit for GPT-4o
    else:
        max_tokens = 15000  # Lower limit for other models like GPT-3.5

    if token_count > max_tokens:
        logger.warning(
            f"Text too long ({token_count} tokens), truncating to {max_tokens} tokens"
        )
        # Simple truncation strategy - in production you'd want a more sophisticated approach
        ratio = max_tokens / token_count
        text = text[: int(len(text) * ratio)]

    # Prepare the prompt for the LLM
    system_prompt = """
    You are a financial analysis expert. Analyze the provided bank statement text and extract the following information:
    
    1. Total income (sum of all deposits/incoming transactions)
    2. Total expenses (sum of all withdrawals/outgoing transactions)
    3. Savings rate (percentage of income saved)
    4. Top spending categories with amounts (e.g., Housing, Food, Transportation, etc.)
    5. Financial recommendations based on spending patterns
    6. Trait scores (0-100) for the following financial traits:
       - Saver: How well the person saves money
       - Investor: How well the person invests money
       - Planner: How well the person plans their finances
       - Knowledgeable: How financially knowledgeable the person appears to be
    7. XP earned (between 100-1000) based on overall financial health
    
    Return the results in a JSON format with the following structure:
    {
      "totalIncome": float,
      "totalExpenses": float,
      "savingsRate": float,
      "topCategories": [
        {"name": string, "amount": float},
        ...
      ],
      "recommendations": [string, string, ...],
      "traits": {
        "saver": int,
        "investor": int,
        "planner": int,
        "knowledgeable": int
      },
      "xpEarned": int
    }
    """

    user_prompt = f"Here is the bank statement text to analyze:\n\n{text}"

    try:
        logger.info(f"Using model: {model} to analyze statement")

        # Use OpenAI API
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)

        # Ensure the result has the expected format
        if "traits" not in result or not isinstance(result["traits"], dict):
            logger.warning("LLM response missing traits, adding default values")
            result["traits"] = {
                "saver": 50,
                "investor": 50,
                "planner": 50,
                "knowledgeable": 50,
            }
        else:
            # Ensure all required traits are present
            for trait in ["saver", "investor", "planner", "knowledgeable"]:
                if trait not in result["traits"]:
                    result["traits"][trait] = 50

        # Ensure xpEarned is present
        if "xpEarned" not in result or not isinstance(result["xpEarned"], int):
            logger.warning("LLM response missing xpEarned, adding default value")
            result["xpEarned"] = 100

        return result

    except Exception as e:
        logger.error(f"Error analyzing statement with LLM: {e}")
        # Return a default response in case of error
        return {
            "totalIncome": 0.0,
            "totalExpenses": 0.0,
            "savingsRate": 0.0,
            "topCategories": [],
            "recommendations": ["Unable to analyze statement due to an error."],
            "traits": {"saver": 50, "investor": 50, "planner": 50, "knowledgeable": 50},
            "xpEarned": 100,
        }


def process_pdf_statements(
    pdf_files: List[Any], model: str = DEFAULT_MODEL
) -> Dict[str, Any]:
    """
    Process multiple PDF statements and return combined analysis.

    Args:
        pdf_files: List of PDF file objects
        model: The LLM model to use for analysis

    Returns:
        Dict with analysis results
    """
    all_text = ""

    # Extract text from all PDFs
    for pdf_file in pdf_files:
        try:
            text = extract_text_from_pdf(pdf_file)
            all_text += text + "\n\n--- NEW STATEMENT ---\n\n"
        except Exception as e:
            logger.error(f"Error processing PDF: {e}")
            continue

    if not all_text:
        raise ValueError("No text could be extracted from the provided PDFs")

    # Analyze the combined text
    analysis_result = analyze_statement_with_llm(all_text, model)

    return analysis_result
