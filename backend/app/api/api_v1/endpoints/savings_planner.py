import json
import logging
import os
from typing import Any, Dict, List, Optional

from app.api import deps
from app.services.pdf_analysis import DEFAULT_MODEL
from fastapi import APIRouter, Depends, HTTPException, Query, status
from openai import OpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)


class SavingsRequest(BaseModel):
    """Request model for savings suggestions."""

    averageMonthlyIncome: float
    averageMonthlyExpenses: float
    currentSavingsRate: float
    targetSavingsRate: float
    topCategories: List[Dict[str, Any]]


@router.post("/suggestions", response_model=Dict[str, Any])
async def generate_savings_suggestions(
    request: SavingsRequest,
    model: Optional[str] = Query(
        DEFAULT_MODEL,
        description="The LLM model to use for analysis (e.g., gpt-4o, gpt-3.5-turbo)",
    ),
    current_user: Optional[Any] = None,  # Made optional for testing
):
    """
    Generate AI-powered savings suggestions based on expense data and savings target.

    This endpoint:
    1. Takes expense data and savings target
    2. Uses an LLM to generate personalized savings suggestions
    3. Returns daily/weekly spending limits and category-specific advice
    """
    try:
        # Calculate basic metrics
        target_savings_amount = request.averageMonthlyIncome * (
            request.targetSavingsRate / 100
        )
        current_savings_amount = request.averageMonthlyIncome * (
            request.currentSavingsRate / 100
        )
        additional_savings_needed = target_savings_amount - current_savings_amount

        # Calculate daily and weekly spending limits
        daily_spending_limit = (
            request.averageMonthlyIncome - target_savings_amount
        ) / 30
        weekly_spending_limit = (
            request.averageMonthlyIncome - target_savings_amount
        ) / 4.3

        # Prepare the data for the LLM
        expense_data = {
            "averageMonthlyIncome": request.averageMonthlyIncome,
            "averageMonthlyExpenses": request.averageMonthlyExpenses,
            "currentSavingsRate": request.currentSavingsRate,
            "targetSavingsRate": request.targetSavingsRate,
            "topCategories": request.topCategories,
            "targetSavingsAmount": target_savings_amount,
            "currentSavingsAmount": current_savings_amount,
            "additionalSavingsNeeded": additional_savings_needed,
            "dailySpendingLimit": daily_spending_limit,
            "weeklySpendingLimit": weekly_spending_limit,
        }

        # Use LLM to generate personalized suggestions
        system_prompt = """
        You are a financial advisor specializing in personal savings strategies. 
        Analyze the provided financial data and generate personalized savings suggestions.
        
        For each spending category, suggest a reasonable reduction amount and provide a specific, 
        actionable tip to achieve that reduction.
        
        Also provide 4-5 general savings tips that are relevant to the person's spending patterns.
        
        Return the results in a JSON format with the following structure:
        {
          "categorySuggestions": [
            {
              "category": string,
              "currentAmount": float,
              "suggestedAmount": float,
              "reduction": float,
              "tip": string
            },
            ...
          ],
          "generalTips": [string, string, ...]
        }
        """

        user_prompt = f"Here is the financial data to analyze:\n\n{json.dumps(expense_data, indent=2)}"

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

            llm_result = json.loads(response.choices[0].message.content)

            # Combine the calculated metrics with the LLM suggestions
            result = {
                "targetSavingsRate": request.targetSavingsRate,
                "targetSavingsAmount": target_savings_amount,
                "currentSavingsAmount": current_savings_amount,
                "additionalSavingsNeeded": additional_savings_needed,
                "dailySpendingLimit": daily_spending_limit,
                "weeklySpendingLimit": weekly_spending_limit,
                "categorySuggestions": llm_result.get("categorySuggestions", []),
                "generalTips": llm_result.get("generalTips", []),
            }

            return result

        except Exception as e:
            logger.error(f"Error generating suggestions with LLM: {e}")
            # Fall back to rule-based suggestions if LLM fails
            return generate_fallback_suggestions(expense_data)

    except Exception as e:
        logger.error(f"Error in savings suggestions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating savings suggestions",
        )


def generate_fallback_suggestions(expense_data):
    """Generate rule-based suggestions if the LLM call fails."""
    target_savings_amount = expense_data["targetSavingsAmount"]
    additional_savings_needed = expense_data["additionalSavingsNeeded"]
    top_categories = expense_data["topCategories"]

    # Generate category-specific suggestions
    category_suggestions = []
    for category in top_categories:
        percent_reduction = min(
            25,
            max(
                5,
                additional_savings_needed
                / expense_data["averageMonthlyExpenses"]
                * 100,
            ),
        )
        suggested_reduction = category["amount"] * (percent_reduction / 100)
        new_amount = category["amount"] - suggested_reduction

        tip = f"Look for ways to reduce {category['name'].lower()} expenses by {percent_reduction:.1f}%."

        # Add some specific tips for common categories
        if category["name"].lower() == "food":
            tip = "Try meal prepping on weekends to reduce food costs."
        elif category["name"].lower() == "entertainment":
            tip = "Look for free or low-cost entertainment options in your area."
        elif category["name"].lower() == "shopping":
            tip = "Consider a 24-hour waiting period before non-essential purchases."
        elif category["name"].lower() == "transportation":
            tip = "Combine errands to save on fuel or transit costs."

        category_suggestions.append(
            {
                "category": category["name"],
                "currentAmount": category["amount"],
                "suggestedAmount": new_amount,
                "reduction": suggested_reduction,
                "tip": tip,
            }
        )

    # General savings tips
    general_tips = [
        "Set up automatic transfers to your savings account on payday",
        "Use cash for discretionary spending to make it more tangible",
        "Review subscriptions monthly and cancel unused services",
        "Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    ]

    return {
        "targetSavingsRate": expense_data["targetSavingsRate"],
        "targetSavingsAmount": expense_data["targetSavingsAmount"],
        "currentSavingsAmount": expense_data["currentSavingsAmount"],
        "additionalSavingsNeeded": expense_data["additionalSavingsNeeded"],
        "dailySpendingLimit": expense_data["dailySpendingLimit"],
        "weeklySpendingLimit": expense_data["weeklySpendingLimit"],
        "categorySuggestions": category_suggestions,
        "generalTips": general_tips,
    }
