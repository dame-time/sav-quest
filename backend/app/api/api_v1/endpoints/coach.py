from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
from app.api.deps import get_current_user
from app.models.user import User
from app.core.config import settings
import openai
import json
from datetime import datetime, timedelta
import re

router = APIRouter()

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY

@router.post("/message")
async def process_message(
    message: str = Body(..., embed=True)
):
    """
    Process a message from the user and return an AI response
    """
    try:
        # Use a mock user for hackathon purposes
        mock_user = {"id": 1, "username": "DemoUser"}
        
        # Check if this is a transaction search query
        is_transaction_query = bool(re.search(r'spend|cost|pay|expense|transaction|subscription', message, re.IGNORECASE))
        
        if is_transaction_query:
            # Process as a transaction search
            search_results = search_transactions(message, mock_user["id"])
            
            # Generate AI response with transaction data context
            ai_response = await generate_ai_response(
                message, 
                mock_user, 
                transaction_data=search_results
            )
            
            return {
                "response": ai_response,
                "searchResults": search_results,
                "suggestedQuestions": generate_suggested_questions(message, ai_response)
            }
        else:
            # Process as a regular question
            ai_response = await generate_ai_response(message, mock_user)
            
            return {
                "response": ai_response,
                "suggestedQuestions": generate_suggested_questions(message, ai_response)
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

async def generate_ai_response(
    message: str, 
    user: Dict[str, Any], 
    transaction_data: Optional[Dict[str, Any]] = None
) -> str:
    """
    Generate an AI response using OpenAI
    """
    # Get user financial data (mock data for now)
    financial_data = get_mock_financial_data(user["id"])
    
    # Create the prompt
    system_prompt = """
    You are an expert financial coach named SavQuest Coach. Your role is to provide personalized financial advice 
    based on the user's financial data and learning progress. Be supportive, educational, and actionable in your guidance.
    
    Guidelines:
    - Provide specific, personalized advice based on the user's financial data
    - Explain financial concepts in simple terms
    - Suggest concrete next steps the user can take
    - Reference relevant learning modules when appropriate
    - Be encouraging and positive, focusing on progress
    - Keep responses concise (max 3-4 paragraphs)
    - Never recommend specific investment products or make promises about returns
    - Always prioritize building emergency savings and debt reduction before investment advice
    """
    
    # Add financial context to the prompt
    financial_context = f"""
    USER FINANCIAL PROFILE:
    - Monthly Income: ${financial_data['income']}
    - Monthly Expenses: ${financial_data['expenses']}
    - Monthly Savings: ${financial_data['savings']}
    - Savings Rate: {financial_data['savingsRate']}%
    - Debt-to-Income Ratio: {financial_data['debtToIncomeRatio'] * 100}%
    - Total Debt: ${financial_data['debt']}
    
    SPENDING BREAKDOWN:
    - Housing: ${financial_data['spendingCategories']['housing']} ({round(financial_data['spendingCategories']['housing']/financial_data['income']*100)}% of income)
    - Food: ${financial_data['spendingCategories']['food']} ({round(financial_data['spendingCategories']['food']/financial_data['income']*100)}% of income)
    - Transportation: ${financial_data['spendingCategories']['transportation']} ({round(financial_data['spendingCategories']['transportation']/financial_data['income']*100)}% of income)
    - Entertainment: ${financial_data['spendingCategories']['entertainment']} ({round(financial_data['spendingCategories']['entertainment']/financial_data['income']*100)}% of income)
    - Utilities: ${financial_data['spendingCategories']['utilities']} ({round(financial_data['spendingCategories']['utilities']/financial_data['income']*100)}% of income)
    - Other: ${financial_data['spendingCategories']['other']} ({round(financial_data['spendingCategories']['other']/financial_data['income']*100)}% of income)
    """
    
    # Add transaction data if available
    transaction_context = ""
    if transaction_data:
        transaction_context = f"""
        TRANSACTION SEARCH RESULTS:
        - Query: "{message}"
        - Time Period: {transaction_data['summary']['time_period']}
        - Total Spent: ${transaction_data['summary']['total_spent']}
        - Breakdown by Merchant: {json.dumps(transaction_data['summary']['by_merchant'])}
        """
    
    # Combine all context
    full_prompt = f"{system_prompt}\n\n{financial_context}\n\n{transaction_context}\n\nUser: {message}\nSavQuest Coach:"
    
    # Call OpenAI API
    response = await openai.ChatCompletion.acreate(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{financial_context}\n\n{transaction_context}\n\nUser: {message}"}
        ],
        max_tokens=500,
        temperature=0.7
    )
    
    return response.choices[0].message.content

def search_transactions(query: str, user_id: int) -> Dict[str, Any]:
    """
    Search transactions based on natural language query
    """
    # Extract time period
    time_period = extract_time_period(query)
    
    # Extract merchants or categories
    merchants = extract_merchants(query)
    categories = extract_categories(query)
    
    # Get mock transaction data
    all_transactions = get_mock_transactions(user_id)
    
    # Filter transactions
    matching_transactions = []
    for transaction in all_transactions:
        # Check if transaction is within time period
        transaction_date = datetime.strptime(transaction['date'], "%Y-%m-%d")
        if not (time_period[0] <= transaction_date <= time_period[1]):
            continue
            
        # Check if transaction matches merchants or categories
        merchant_match = any(m.lower() in transaction['merchant'].lower() for m in merchants)
        category_match = any(c.lower() in transaction['category'].lower() for c in categories)
        
        if merchant_match or category_match:
            matching_transactions.append(transaction)
    
    # Aggregate results
    total_spent = sum(t['amount'] for t in matching_transactions)
    by_merchant = {}
    for t in matching_transactions:
        if t['merchant'] not in by_merchant:
            by_merchant[t['merchant']] = 0
        by_merchant[t['merchant']] += t['amount']
    
    # Format time period for display
    time_period_str = f"{time_period[0].strftime('%b %d, %Y')} to {time_period[1].strftime('%b %d, %Y')}"
    
    return {
        "transactions": matching_transactions,
        "summary": {
            "total_spent": abs(total_spent),
            "by_merchant": by_merchant,
            "time_period": time_period_str
        }
    }

def extract_time_period(query: str) -> tuple:
    """
    Extract time period from query
    """
    # Default to last 3 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    # Look for specific time periods
    if re.search(r'last\s+month', query, re.IGNORECASE):
        start_date = end_date.replace(day=1) - timedelta(days=1)
        start_date = start_date.replace(day=1)
    elif re.search(r'last\s+3\s+months', query, re.IGNORECASE):
        start_date = end_date - timedelta(days=90)
    elif re.search(r'last\s+6\s+months', query, re.IGNORECASE):
        start_date = end_date - timedelta(days=180)
    elif re.search(r'this\s+year', query, re.IGNORECASE):
        start_date = end_date.replace(month=1, day=1)
    elif re.search(r'last\s+year', query, re.IGNORECASE):
        start_date = end_date.replace(year=end_date.year-1, month=1, day=1)
        end_date = end_date.replace(year=end_date.year-1, month=12, day=31)
    
    return (start_date, end_date)

def extract_merchants(query: str) -> List[str]:
    """
    Extract merchant names from query
    """
    # Common streaming services
    streaming_services = ["netflix", "hulu", "disney", "amazon prime", "spotify", "apple music", 
                         "hbo", "youtube", "paramount", "peacock"]
    
    # Check for streaming services in query
    found_services = []
    for service in streaming_services:
        if service.lower() in query.lower():
            found_services.append(service)
    
    # If query mentions streaming but no specific services
    if not found_services and re.search(r'stream|subscription', query, re.IGNORECASE):
        found_services = streaming_services
    
    return found_services if found_services else [""]

def extract_categories(query: str) -> List[str]:
    """
    Extract categories from query
    """
    categories = []
    
    # Map keywords to categories
    category_keywords = {
        "food": ["food", "grocery", "restaurant", "dining", "eat", "lunch", "dinner"],
        "entertainment": ["entertainment", "movie", "stream", "subscription", "netflix", "hulu"],
        "transportation": ["transportation", "gas", "uber", "lyft", "taxi", "car", "bus", "train"],
        "utilities": ["utilities", "electric", "water", "gas", "internet", "phone"],
        "housing": ["housing", "rent", "mortgage", "apartment"],
        "shopping": ["shopping", "clothes", "amazon", "online"]
    }
    
    for category, keywords in category_keywords.items():
        if any(keyword in query.lower() for keyword in keywords):
            categories.append(category)
    
    return categories if categories else [""]

def get_mock_financial_data(user_id: int) -> Dict[str, Any]:
    """
    Get mock financial data for the user
    """
    return {
        "income": 4500,
        "expenses": 3200,
        "savings": 800,
        "debt": 12000,
        "spendingCategories": {
            "housing": 1400,
            "food": 600,
            "transportation": 350,
            "entertainment": 250,
            "utilities": 200,
            "other": 400
        },
        "savingsRate": 17.8,
        "debtToIncomeRatio": 0.22
    }

def get_mock_transactions(user_id: int) -> List[Dict[str, Any]]:
    """
    Get mock transaction data for the user
    """
    # Generate 6 months of transactions
    transactions = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # Streaming services
    streaming_services = [
        {"merchant": "Netflix", "amount": -15.99, "category": "Entertainment"},
        {"merchant": "Hulu", "amount": -11.99, "category": "Entertainment"},
        {"merchant": "Disney+", "amount": -7.99, "category": "Entertainment"},
        {"merchant": "Spotify", "amount": -9.99, "category": "Entertainment"},
        {"merchant": "Amazon Prime", "amount": -12.99, "category": "Entertainment"}
    ]
    
    # Generate monthly transactions for each streaming service
    current_date = start_date
    while current_date <= end_date:
        for service in streaming_services:
            # Add some randomness to the date (between 1st and 5th of month)
            transaction_date = current_date.replace(day=1) + timedelta(days=service['merchant'].__hash__() % 5)
            
            if transaction_date <= end_date:
                transactions.append({
                    "id": len(transactions) + 1,
                    "merchant": service["merchant"],
                    "amount": service["amount"],
                    "category": service["category"],
                    "date": transaction_date.strftime("%Y-%m-%d"),
                    "description": "Monthly subscription"
                })
        
        # Move to next month
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)
    
    # Add other transaction categories
    # (This would be expanded in a real implementation)
    
    return transactions

def generate_suggested_questions(message: str, ai_response: str) -> List[str]:
    """
    Generate suggested follow-up questions based on the conversation
    """
    # Simple rule-based approach
    suggested_questions = []
    
    if re.search(r'savings|save', message, re.IGNORECASE):
        suggested_questions = [
            "What savings goals should I set?",
            "How much emergency fund do I need?",
            "What's the best savings account type for me?"
        ]
    elif re.search(r'budget|spending', message, re.IGNORECASE):
        suggested_questions = [
            "How can I reduce my food expenses?",
            "Is my housing cost reasonable?",
            "What budgeting method would work best for me?"
        ]
    elif re.search(r'debt|loan', message, re.IGNORECASE):
        suggested_questions = [
            "Should I pay off debt or save more?",
            "What's the best way to tackle my debt?",
            "How can I improve my credit score?"
        ]
    elif re.search(r'subscription|streaming', message, re.IGNORECASE):
        suggested_questions = [
            "How can I reduce my subscription costs?",
            "Which streaming services offer the best value?",
            "Should I consider bundling my subscriptions?"
        ]
    else:
        suggested_questions = [
            "What financial habits should I develop?",
            "How am I doing compared to others?",
            "What's my biggest financial opportunity?"
        ]
    
    return suggested_questions 