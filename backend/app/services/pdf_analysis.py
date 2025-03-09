import json
import logging
import os
from typing import Any, Dict, List, Optional, Tuple

# Remove the fitz import
# import fitz  # PyMuPDF
import tiktoken
from app.core.config import settings
from pypdf import PdfReader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check if mock responses should be used
USE_MOCK_RESPONSES = os.environ.get("USE_MOCK_RESPONSES", "").lower() in [
    "true",
    "1",
    "yes",
]
if USE_MOCK_RESPONSES:
    logger.info(
        "Mock responses are ENABLED. Will use mock data instead of calling LLM APIs."
    )
else:
    logger.info("Mock responses are DISABLED. Will use real LLM APIs.")

# Initialize OpenAI client
openai_client = None
try:
    from openai import OpenAI

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if openai_api_key:
        openai_client = OpenAI(api_key=openai_api_key)
        logger.info("OpenAI client initialized successfully")
    else:
        logger.warning("OpenAI API key not found in environment variables")
        if not USE_MOCK_RESPONSES:
            logger.warning(
                "Consider setting USE_MOCK_RESPONSES=true if you don't have an OpenAI API key"
            )
except ImportError:
    logger.warning("OpenAI package not installed")
    if not USE_MOCK_RESPONSES:
        logger.warning(
            "Consider setting USE_MOCK_RESPONSES=true if you don't have the OpenAI package installed"
        )
except Exception as e:
    logger.error(f"Error initializing OpenAI client: {str(e)}")
    if not USE_MOCK_RESPONSES:
        logger.warning("Consider setting USE_MOCK_RESPONSES=true to bypass API issues")

# Initialize DeepSeek client if available
deepseek_available = False
deepseek_client = None
try:
    from deepseek import DeepSeekChat

    deepseek_available = True
    logger.info("DeepSeek package available")
except ImportError:
    logger.warning("DeepSeek package not available. Will use OpenAI only.")

# Default model to use
DEFAULT_MODEL = "gpt-4o"
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
    """
    Extract text from a PDF file using PyPDF.

    Args:
        pdf_file: PDF file object

    Returns:
        Extracted text as a string
    """
    try:
        # Save the uploaded file to a temporary location
        temp_file_path = f"/tmp/{pdf_file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(pdf_file.file.read())

        # Reset file pointer
        pdf_file.file.seek(0)

        # Extract text using PyPDF
        reader = PdfReader(temp_file_path)
        text = ""

        # Extract text from each page
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"

        # Clean up the temporary file
        os.remove(temp_file_path)

        if not text.strip():
            logger.warning(f"No text extracted from PDF: {pdf_file.filename}")
            return "No text could be extracted from this PDF."

        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")


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
    # Check if we should use a mock response for testing
    if USE_MOCK_RESPONSES:
        logger.info(
            "Using mock response for statement analysis (USE_MOCK_RESPONSES is enabled)"
        )
        # Return a realistic mock response for testing
        return {
            "totalIncome": 3500.00,
            "totalExpenses": 2800.00,
            "savingsRate": 20.0,
            "topCategories": [
                {"category": "Housing", "amount": 1200.00},
                {"category": "Food", "amount": 600.00},
                {"category": "Transportation", "amount": 400.00},
                {"category": "Entertainment", "amount": 300.00},
                {"category": "Utilities", "amount": 200.00},
            ],
            "recommendations": [
                "Consider reducing your dining out expenses by cooking more meals at home.",
                "Your subscription services total $85/month. Review these for services you may not be using.",
                "You could save approximately $120/month by refinancing your current loans.",
                "Setting up automatic transfers to your savings account can help increase your savings rate.",
            ],
            "traits": {"saver": 65, "investor": 45, "planner": 70, "knowledgeable": 60},
            "xpEarned": 350,
        }

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
        {
          "category": string,
          "amount": float
        }
      ],
      "recommendations": [string],
      "traits": {
        "saver": int,
        "investor": int,
        "planner": int,
        "knowledgeable": int
      },
      "xpEarned": int
    }
    
    Analyze the statement carefully and provide accurate numbers and helpful recommendations.
    """

    user_prompt = f"Here is the bank statement text to analyze:\n\n{text}"

    try:
        # Use OpenAI API
        if "gpt" in model.lower():
            # Check if OpenAI client is available
            if openai_client is None:
                logger.error("OpenAI client is not available")
                raise ValueError(
                    "OpenAI client is not available. Please check your API key or enable mock responses."
                )

            logger.info(f"Sending request to OpenAI with model: {model}")
            response = openai_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                max_tokens=2000,
            )
            result_text = response.choices[0].message.content
            logger.info("Successfully received response from OpenAI")
        else:
            # DeepSeek model
            if not deepseek_available:
                logger.error("DeepSeek is not available")
                raise ValueError(
                    "DeepSeek is not available. Please use an OpenAI model or enable mock responses."
                )

            # Create a new DeepSeek client instance
            deepseek_client = DeepSeekChat()

            logger.info(f"Sending request to DeepSeek with model: {model}")
            response = deepseek_client.chat(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                max_tokens=2000,
            )
            result_text = response.choices[0].message.content
            logger.info("Successfully received response from DeepSeek")

        # Parse the JSON response
        import json
        import re

        logger.info("Parsing JSON response")
        # Extract JSON from the response (in case the LLM adds extra text)
        json_match = re.search(r"({[\s\S]*})", result_text)
        if json_match:
            json_str = json_match.group(1)
            try:
                result = json.loads(json_str)
                logger.info("Successfully parsed JSON response")
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing JSON: {str(e)}")
                logger.error(f"JSON string: {json_str}")
                raise ValueError("Invalid JSON response from LLM")
        else:
            logger.error(f"Could not extract JSON from response: {result_text}")
            raise ValueError("Could not extract JSON from LLM response")

        return result

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        # Return a fallback response
        return {
            "totalIncome": 0.0,
            "totalExpenses": 0.0,
            "savingsRate": 0.0,
            "topCategories": [],
            "recommendations": [
                f"Unable to analyze statement due to an error: {str(e)}"
            ],
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
    # Check if we should use a mock response for testing
    if USE_MOCK_RESPONSES:
        logger.info(
            "Using mock response for statement analysis (USE_MOCK_RESPONSES is enabled)"
        )
        # Return a realistic mock response for testing
        return {
            "totalIncome": 3500.00,
            "totalExpenses": 2800.00,
            "savingsRate": 20.0,
            "topCategories": [
                {"category": "Housing", "amount": 1200.00},
                {"category": "Food", "amount": 600.00},
                {"category": "Transportation", "amount": 400.00},
                {"category": "Entertainment", "amount": 300.00},
                {"category": "Utilities", "amount": 200.00},
            ],
            "recommendations": [
                "Consider reducing your dining out expenses by cooking more meals at home.",
                "Your subscription services total $85/month. Review these for services you may not be using.",
                "You could save approximately $120/month by refinancing your current loans.",
                "Setting up automatic transfers to your savings account can help increase your savings rate.",
            ],
            "traits": {"saver": 65, "investor": 45, "planner": 70, "knowledgeable": 60},
            "xpEarned": 350,
            "numStatements": len(pdf_files),
        }

    all_text = ""
    num_statements = len(pdf_files)

    # Extract text from all PDFs
    for pdf_file in pdf_files:
        try:
            text = extract_text_from_pdf(pdf_file)
            all_text += text + "\n\n--- NEW STATEMENT ---\n\n"
        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            continue

    if not all_text:
        raise ValueError("No text could be extracted from the provided PDFs")

    # Analyze the combined text
    analysis_result = analyze_statement_with_llm(all_text, model)

    # Add the number of statements to the result
    analysis_result["numStatements"] = num_statements

    # If we have multiple statements, adjust the income and expenses to be monthly averages
    if num_statements > 1:
        analysis_result["totalIncomeAllStatements"] = analysis_result["totalIncome"]
        analysis_result["totalExpensesAllStatements"] = analysis_result["totalExpenses"]

        # Calculate monthly averages
        analysis_result["totalIncome"] = analysis_result["totalIncome"] / num_statements
        analysis_result["totalExpenses"] = (
            analysis_result["totalExpenses"] / num_statements
        )

        # Recalculate savings rate based on monthly averages
        if analysis_result["totalIncome"] > 0:
            analysis_result["savingsRate"] = (
                (analysis_result["totalIncome"] - analysis_result["totalExpenses"])
                / analysis_result["totalIncome"]
                * 100
            )
        else:
            analysis_result["savingsRate"] = 0

        # Adjust category spending to be monthly averages
        for category in analysis_result.get("topCategories", []):
            if "amount" in category:
                category["amount"] = category["amount"] / num_statements

    return analysis_result


def analyze_monthly_prediction(
    current_month_pdf: Any, model: str = DEFAULT_MODEL
) -> Dict[str, Any]:
    """
    Analyze the current month's bank statement and provide spending predictions and savings advice.

    Args:
        current_month_pdf: PDF file object for the current month's statement
        model: The LLM model to use for analysis

    Returns:
        Dict with prediction results and savings advice
    """
    # Check if we should use a mock response for testing
    if USE_MOCK_RESPONSES:
        logger.info(
            "Using mock response for monthly prediction (USE_MOCK_RESPONSES is enabled)"
        )
        # Return a realistic mock response for testing
        return {
            "projectedSpending": 2450.75,
            "comparisonToPrevious": {
                "difference": -125.50,
                "percentageChange": -4.87,
                "isHigher": False,
            },
            "unusualExpenses": [
                {
                    "category": "Electronics",
                    "amount": 349.99,
                    "description": "New headphones purchase",
                }
            ],
            "projectedSavingsRate": 18.5,
            "highSpendingCategories": [
                {
                    "category": "Dining Out",
                    "amount": 320.45,
                    "percentageAboveNormal": 15.2,
                },
                {
                    "category": "Entertainment",
                    "amount": 180.30,
                    "percentageAboveNormal": 12.8,
                },
            ],
            "savingsOpportunities": [
                {
                    "category": "Dining Out",
                    "potentialSavings": 120.00,
                    "advice": "Consider cooking at home more often. Meal prepping on weekends can save both time and money during the week.",
                },
                {
                    "category": "Subscriptions",
                    "potentialSavings": 45.00,
                    "advice": "Review your current subscriptions and cancel those you rarely use. Many people forget about recurring subscriptions.",
                },
            ],
            "projectedEndBalance": 3250.80,
            "onTrackForGoals": True,
            "savingsOpportunityScore": 65,
            "overallAdvice": "You're doing well overall, but there's room for improvement in your dining out expenses. Your current spending pattern suggests you'll meet your monthly savings goal, but cutting back on restaurants could help you exceed it.",
            "xpEarned": 425,
        }

    # Extract text from the current month's PDF
    try:
        logger.info(f"Extracting text from PDF: {current_month_pdf.filename}")
        current_month_text = extract_text_from_pdf(current_month_pdf)

        if current_month_text == "No text could be extracted from this PDF.":
            logger.error("No text could be extracted from the PDF")
            raise ValueError(
                "The PDF file doesn't contain extractable text. Please ensure it's a valid bank statement."
            )

        logger.info(
            f"Successfully extracted {len(current_month_text)} characters from PDF"
        )
    except Exception as e:
        logger.error(f"Error processing current month PDF: {str(e)}")
        raise ValueError(
            f"Could not extract text from the current month's statement: {str(e)}"
        )

    # Prepare the prompt for the LLM
    system_prompt = """
    You are a financial prediction expert. Analyze the provided bank statement for the current month (which may be incomplete as the month is still ongoing) and provide the following:
    
    1. Projected total spending for the full month based on current spending patterns
    2. Comparison to previous months' average spending (if mentioned in the statement)
    3. Identification of any unusual or one-time expenses this month
    4. Projected savings rate for this month
    5. Categories where spending is higher than usual
    6. Categories where the user could potentially save money
    7. Specific, actionable advice for reducing expenses in the identified categories
    8. Projected month-end account balance
    9. Whether the user is on track to meet their financial goals (if any are mentioned)
    10. A savings opportunity score (0-100) indicating how much potential there is to save more
    
    Return the results in a JSON format with the following structure:
    {
      "projectedSpending": float,
      "comparisonToPrevious": {
        "difference": float,
        "percentageChange": float,
        "isHigher": boolean
      },
      "unusualExpenses": [
        {
          "category": string,
          "amount": float,
          "description": string
        }
      ],
      "projectedSavingsRate": float,
      "highSpendingCategories": [
        {
          "category": string,
          "amount": float,
          "percentageAboveNormal": float
        }
      ],
      "savingsOpportunities": [
        {
          "category": string,
          "potentialSavings": float,
          "advice": string
        }
      ],
      "projectedEndBalance": float,
      "onTrackForGoals": boolean,
      "savingsOpportunityScore": int,
      "overallAdvice": string
    }
    
    Analyze the statement carefully and provide realistic projections and actionable advice.
    """

    user_prompt = f"Here is the bank statement for the current month. Please analyze it and provide spending predictions and savings advice:\n\n{current_month_text}"

    # Call the LLM
    try:
        if "gpt" in model.lower():
            # OpenAI model
            try:
                # Check if OpenAI client is available
                if openai_client is None:
                    logger.error("OpenAI client is not available")
                    raise ValueError(
                        "OpenAI client is not available. Please check your API key or enable mock responses."
                    )

                logger.info(f"Sending request to OpenAI with model: {model}")
                response = openai_client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.2,
                    max_tokens=2000,
                )

                result_text = response.choices[0].message.content
                logger.info("Successfully received response from OpenAI")
            except ImportError:
                logger.error("OpenAI package is not installed")
                raise ValueError("OpenAI package is not installed")
            except Exception as e:
                logger.error(f"Error with OpenAI API: {str(e)}")
                raise ValueError(f"Error with OpenAI API: {str(e)}")
        else:
            # DeepSeek model (or other models could be added here)
            try:
                if not deepseek_available:
                    logger.error("DeepSeek is not available")
                    raise ValueError(
                        "DeepSeek is not available. Please use an OpenAI model or enable mock responses."
                    )

                # Create a new DeepSeek client instance
                deepseek_client = DeepSeekChat()

                logger.info(f"Sending request to DeepSeek with model: {model}")
                response = deepseek_client.chat(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.2,
                    max_tokens=2000,
                )

                result_text = response.choices[0].message.content
                logger.info("Successfully received response from DeepSeek")
            except ImportError:
                logger.error("DeepSeek package is not installed")
                raise ValueError("DeepSeek package is not installed")
            except Exception as e:
                logger.error(f"Error with DeepSeek API: {str(e)}")
                raise ValueError(f"Error with DeepSeek API: {str(e)}")

        # Parse the JSON response
        import json
        import re

        logger.info("Parsing JSON response")
        # Extract JSON from the response (in case the LLM adds extra text)
        json_match = re.search(r"({[\s\S]*})", result_text)
        if json_match:
            json_str = json_match.group(1)
            try:
                result = json.loads(json_str)
                logger.info("Successfully parsed JSON response")
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing JSON: {str(e)}")
                logger.error(f"JSON string: {json_str}")
                raise ValueError("Invalid JSON response from LLM")
        else:
            logger.error(f"Could not extract JSON from response: {result_text}")
            raise ValueError("Could not extract JSON from LLM response")

        # Add XP earned based on the savings opportunity score
        result["xpEarned"] = min(
            100 + result.get("savingsOpportunityScore", 0) * 5, 500
        )

        return result

    except Exception as e:
        logger.error(f"Error in LLM analysis: {str(e)}")
        # Return a fallback response
        return {
            "projectedSpending": 0.0,
            "comparisonToPrevious": {
                "difference": 0.0,
                "percentageChange": 0.0,
                "isHigher": False,
            },
            "unusualExpenses": [],
            "projectedSavingsRate": 0.0,
            "highSpendingCategories": [],
            "savingsOpportunities": [],
            "projectedEndBalance": 0.0,
            "onTrackForGoals": False,
            "savingsOpportunityScore": 50,
            "overallAdvice": f"Unable to analyze statement due to an error: {str(e)}",
            "xpEarned": 100,
        }
