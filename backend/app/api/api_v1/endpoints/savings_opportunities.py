import json
import logging
import os
from typing import Any, Dict, List, Optional

from app.api import deps
from app.services.pdf_analysis import DEFAULT_MODEL
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)

# Check if mock responses should be used
USE_MOCK_RESPONSES = os.environ.get("USE_MOCK_RESPONSES", "").lower() in [
    "true",
    "1",
    "yes",
]


@router.get("/insights", response_model=Dict[str, Any])
async def get_savings_insights(
    monthly_income: float = Query(..., description="Monthly income amount"),
    savings_rate: float = Query(..., description="Savings rate percentage (1-30)"),
    model: Optional[str] = Query(
        DEFAULT_MODEL,
        description="The LLM model to use for analysis (e.g., gpt-4o, gpt-3.5-turbo)",
    ),
    db: Session = Depends(deps.get_db),
):
    """
    Get AI-powered insights for savings opportunities based on income and savings rate.

    This endpoint:
    1. Takes monthly income and savings rate as input
    2. Calculates monthly and yearly savings
    3. Generates investment projections for different time periods
    4. Provides personalized recommendations for using the saved money

    Parameters:
    - monthly_income: Monthly income amount
    - savings_rate: Savings rate percentage (1-30)
    - model: The LLM model to use (default: gpt-4o)
    """
    try:
        # Validate inputs
        if monthly_income <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Monthly income must be greater than zero",
            )

        if savings_rate < 1 or savings_rate > 30:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Savings rate must be between 1 and 30 percent",
            )

        # Calculate monthly and yearly savings
        monthly_savings = monthly_income * (savings_rate / 100)
        yearly_savings = monthly_savings * 12

        # Generate investment projections
        projections = generate_investment_projections(monthly_savings)

        # Generate opportunity insights
        opportunities = generate_opportunity_insights(monthly_savings, yearly_savings)

        # Return the combined results
        return {
            "monthly_income": monthly_income,
            "savings_rate": savings_rate,
            "monthly_savings": monthly_savings,
            "yearly_savings": yearly_savings,
            "investment_projections": projections,
            "opportunity_insights": opportunities,
        }

    except ValueError as e:
        logger.error(f"Value error in savings insights: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error in savings insights: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating savings insights: {str(e)}",
        )


def generate_investment_projections(monthly_savings: float) -> List[Dict[str, Any]]:
    """Generate investment projections for different time periods."""
    projections = []
    annual_return = 0.08  # 8% average annual return for S&P 500

    # Calculate compound interest for different time periods
    for years in [1, 3, 5, 10, 20, 30]:
        months = years * 12
        future_value = 0

        # Calculate future value using compound interest formula for monthly contributions
        for i in range(months):
            future_value = (future_value + monthly_savings) * (1 + (annual_return / 12))

        projections.append(
            {
                "years": years,
                "future_value": round(future_value, 2),
                "total_invested": round(monthly_savings * months, 2),
                "interest_earned": round(future_value - (monthly_savings * months), 2),
            }
        )

    return projections


def generate_opportunity_insights(
    monthly_savings: float, yearly_savings: float
) -> Dict[str, Any]:
    """Generate opportunity insights for using the saved money."""

    # Financial Education
    finance_books_per_month = max(1, int(monthly_savings / 20))
    online_courses_per_month = max(1, int(monthly_savings / 100))
    knowledge_roi = min(30, max(10, int(monthly_savings / 100)))

    # Investment Opportunities
    sp500_20yr_value = (
        yearly_savings * 10.62
    )  # Approximate 20-year growth with 8% return
    dividend_income = yearly_savings * 0.04  # Approximate 4% dividend yield

    # Major Purchases
    home_down_payment_5yr = yearly_savings * 5
    vehicles_per_year = max(0, int(yearly_savings / 15000))
    home_improvements_per_year = max(0, int(yearly_savings / 5000))

    # Lifestyle Improvements
    vacations_per_year = max(0, int(yearly_savings / 2000))

    return {
        "financial_education": {
            "books_per_month": finance_books_per_month,
            "courses_per_month": online_courses_per_month,
            "potential_income_increase": knowledge_roi,
            "description": f"You could buy {finance_books_per_month} finance books per month, potentially increasing your income by {knowledge_roi}% through new knowledge.",
        },
        "investment_opportunities": {
            "yearly_investment": yearly_savings,
            "dividend_income": dividend_income,
            "sp500_20yr_projection": sp500_20yr_value,
            "description": f"Investing in index funds could grow to ${sp500_20yr_value:,.2f} over 20 years (8% annual return).",
        },
        "major_purchases": {
            "home_down_payment_5yr": home_down_payment_5yr,
            "vehicles_per_year": vehicles_per_year,
            "home_improvements_per_year": home_improvements_per_year,
            "description": f"In 5 years, you could save ${home_down_payment_5yr:,.2f} for a home down payment or {vehicles_per_year} used car(s) per year.",
        },
        "lifestyle_improvements": {
            "vacations_per_year": vacations_per_year,
            "monthly_housing_upgrade": monthly_savings,
            "description": f"You could take {vacations_per_year} vacations per year or upgrade your living situation by ${monthly_savings:,.2f}/month.",
        },
    }
