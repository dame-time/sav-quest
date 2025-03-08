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
    Generate a mock AI response (no OpenAI API call)
    """
    try:
        # Get user financial data
        financial_data = get_mock_financial_data(user["id"])
        
        # Simple rule-based responses for the hackathon
        if re.search(r'savings|save', message, re.IGNORECASE):
            return f"Based on your current savings rate of {financial_data['savingsRate']}%, you're doing better than average! To improve further, consider setting up automatic transfers of $225 more each month to your savings account. This would increase your savings rate to 22.8%, putting you on track to build a stronger emergency fund."
        
        elif re.search(r'budget|spending', message, re.IGNORECASE):
            return f"Looking at your spending patterns, your largest expense category is housing at ${financial_data['spendingCategories']['housing']} per month ({round(financial_data['spendingCategories']['housing']/financial_data['income']*100)}% of income). Financial experts typically recommend keeping housing costs under 30% of income. Your food spending is ${financial_data['spendingCategories']['food']}, which is about average. One area you might look at reducing is entertainment at ${financial_data['spendingCategories']['entertainment']} - perhaps try a 'no-spend weekend' challenge?"
        
        elif re.search(r'debt|loan', message, re.IGNORECASE):
            return f"Your current debt-to-income ratio is {financial_data['debtToIncomeRatio'] * 100}%, which is in a healthy range (below 36%). You have ${financial_data['debt']} in total debt. If you allocated an extra $300 per month to debt repayment, you could potentially be debt-free in about 3.5 years, depending on interest rates."
        
        elif re.search(r'emergency fund|emergency savings', message, re.IGNORECASE):
            return f"Financial experts typically recommend having 3-6 months of essential expenses saved in an emergency fund. Based on your monthly expenses of ${financial_data['expenses']}, you should aim for ${financial_data['expenses'] * 3} to ${financial_data['expenses'] * 6} in your emergency fund. At your current savings rate of {financial_data['savingsRate']}%, it would take approximately {round((financial_data['expenses'] * 3) / financial_data['savings'])} months to build a 3-month emergency fund."
        
        elif re.search(r'invest|investment', message, re.IGNORECASE):
            return f"Before focusing heavily on investments, it's important to ensure you have an emergency fund and manageable debt. With your savings rate of {financial_data['savingsRate']}%, you're in a good position to start investing once you have 3-6 months of expenses saved. Consider starting with low-cost index funds through a retirement account like a 401(k) or IRA to take advantage of tax benefits."
        
        elif re.search(r'retirement|retire', message, re.IGNORECASE):
            return f"Based on your current income of ${financial_data['income']} per month (${financial_data['income']*12} annually), you should aim to save about 15% of your income for retirement. Currently, your savings rate is {financial_data['savingsRate']}%, which is a good start. If you maintain this rate and invest wisely, you could potentially build a retirement nest egg of over $1 million in 30 years, depending on market performance and consistency."
        
        elif transaction_data:
            merchants = list(transaction_data['summary']['by_merchant'].keys())
            merchant_str = ", ".join(merchants[:3]) if len(merchants) > 0 else "these services"
            return f"I've analyzed your spending on {merchant_str} over the period from {transaction_data['summary']['time_period']}. You spent a total of ${transaction_data['summary']['total_spent']} on these services. This represents about {round(transaction_data['summary']['total_spent'] / (financial_data['income'] * 3) * 100)}% of your income during this period. Consider reviewing these subscriptions to see if you're getting value from all of them."
        
        elif re.search(r'goal|target', message, re.IGNORECASE):
            return f"Setting clear financial goals is important! Based on your profile, here are some suggested goals:\n\n1. Build an emergency fund of ${financial_data['expenses'] * 3} (3 months of expenses)\n2. Increase your savings rate from {financial_data['savingsRate']}% to 25%\n3. Reduce your debt-to-income ratio from {financial_data['debtToIncomeRatio'] * 100}% to under 20%\n\nWhat specific goal would you like to focus on first?"
        
        elif re.search(r'credit score|credit', message, re.IGNORECASE):
            return "Your credit score is influenced by payment history (35%), credit utilization (30%), length of credit history (15%), new credit (10%), and credit mix (10%). To improve your score: pay bills on time, keep credit card balances low (under 30% of limits), avoid opening too many new accounts, and maintain a mix of credit types. Checking your credit report regularly for errors is also important."
        
        elif re.search(r'tax|taxes', message, re.IGNORECASE):
            return f"Based on your annual income of approximately ${financial_data['income']*12}, you might benefit from tax-advantaged accounts like a 401(k) or IRA. Contributing to these accounts can lower your taxable income. Additionally, tracking deductible expenses throughout the year can help maximize your tax refund. Consider consulting with a tax professional for personalized advice."
        
        else:
            return f"Based on your financial profile, you're doing well with a savings rate of {financial_data['savingsRate']}%. Your monthly income is ${financial_data['income']} and expenses are ${financial_data['expenses']}, leaving you with ${financial_data['savings']} in monthly savings. To improve your financial health further, consider reviewing your spending in entertainment (${financial_data['spendingCategories']['entertainment']}) and other categories (${financial_data['spendingCategories']['other']}) to see if there are opportunities to save more."
    
    except Exception as e:
        print(f"Error in generate_ai_response: {str(e)}")
        return "I apologize, but I encountered an error while processing your request. Please try again with a different question."

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