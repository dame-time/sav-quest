#!/usr/bin/env python3
"""
PDF Analysis Test Script

This script allows you to test the PDF parsing and LLM analysis functionality.
It extracts text from a PDF file and sends it to the LLM for analysis,
then displays both the extracted text and the analysis results.

Usage:
    python test_pdf_analysis.py path/to/your/statement.pdf

Requirements:
    pip install pypdf openai tiktoken python-dotenv
"""

import json
import logging
import os
import sys
from pathlib import Path
from typing import Any, Dict

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv

    load_dotenv()
    logger.info("Loaded environment variables from .env file")
except ImportError:
    logger.warning("python-dotenv not installed, using environment variables directly")

# Import required libraries
try:
    import tiktoken
    from openai import OpenAI
    from pypdf import PdfReader
except ImportError as e:
    logger.error(f"Required library not installed: {e}")
    logger.error("Please install required libraries: pip install pypdf openai tiktoken")
    sys.exit(1)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logger.error("OPENAI_API_KEY environment variable not set")
    logger.error(
        "Please set the OPENAI_API_KEY environment variable or add it to a .env file"
    )
    sys.exit(1)

client = OpenAI(api_key=openai_api_key)


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        logger.info(f"Extracting text from PDF: {pdf_path}")
        reader = PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            text += page_text + "\n"
            logger.info(f"Extracted {len(page_text)} characters from page {i+1}")

        logger.info(f"Total extracted text: {len(text)} characters")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        raise ValueError(f"Failed to extract text from PDF: {e}")


def num_tokens_from_string(string: str, model: str = "gpt-3.5-turbo") -> int:
    """Returns the number of tokens in a text string."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(string))


def analyze_statement_with_llm(
    text: str, model: str = "gpt-3.5-turbo"
) -> Dict[str, Any]:
    """
    Analyze bank statement text using an LLM (OpenAI).

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
    max_tokens = 15000  # Safe limit for context window

    if token_count > max_tokens:
        logger.warning(
            f"Text too long ({token_count} tokens), truncating to {max_tokens} tokens"
        )
        # Simple truncation strategy - in production you'd want a more sophisticated approach
        ratio = max_tokens / token_count
        text = text[: int(len(text) * ratio)]
        logger.info(f"Truncated text to {len(text)} characters")

    logger.info(f"Sending {token_count} tokens to {model} for analysis")

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
        logger.info("Successfully received and parsed LLM response")
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


def main():
    """Main function to run the test script."""
    # Check if a PDF file path was provided
    if len(sys.argv) < 2:
        logger.error("No PDF file path provided")
        logger.info("Usage: python test_pdf_analysis.py path/to/your/statement.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]

    # Check if the file exists
    if not Path(pdf_path).is_file():
        logger.error(f"File not found: {pdf_path}")
        sys.exit(1)

    try:
        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(pdf_path)

        # Save the extracted text to a file for inspection
        text_output_path = f"{pdf_path}.txt"
        with open(text_output_path, "w", encoding="utf-8") as f:
            f.write(extracted_text)
        logger.info(f"Saved extracted text to {text_output_path}")

        # Analyze the extracted text
        analysis_result = analyze_statement_with_llm(extracted_text)

        # Save the analysis result to a file
        analysis_output_path = f"{pdf_path}.analysis.json"
        with open(analysis_output_path, "w", encoding="utf-8") as f:
            json.dump(analysis_result, f, indent=2)
        logger.info(f"Saved analysis result to {analysis_output_path}")

        # Print a summary of the analysis
        print("\n" + "=" * 50)
        print("PDF ANALYSIS SUMMARY")
        print("=" * 50)
        print(f"PDF File: {pdf_path}")
        print(
            f"Extracted Text: {len(extracted_text)} characters (saved to {text_output_path})"
        )
        print(f"Analysis Result: (saved to {analysis_output_path})")
        print("\nFinancial Summary:")
        print(f"- Total Income: ${analysis_result.get('totalIncome', 0):.2f}")
        print(f"- Total Expenses: ${analysis_result.get('totalExpenses', 0):.2f}")
        print(f"- Savings Rate: {analysis_result.get('savingsRate', 0):.1f}%")

        print("\nTop Spending Categories:")
        for category in analysis_result.get("topCategories", []):
            print(f"- {category['name']}: ${category['amount']:.2f}")

        print("\nRecommendations:")
        for recommendation in analysis_result.get("recommendations", []):
            print(f"- {recommendation}")

        print("\nTrait Scores:")
        traits = analysis_result.get("traits", {})
        for trait, score in traits.items():
            print(f"- {trait.capitalize()}: {score}/100")

        print(f"\nXP Earned: {analysis_result.get('xpEarned', 0)}")
        print("=" * 50)

        print("\nTest completed successfully!")
        print(f"Extracted text saved to: {text_output_path}")
        print(f"Analysis results saved to: {analysis_output_path}")

    except Exception as e:
        logger.error(f"Error during test: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
