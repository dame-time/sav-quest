from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
import json
import logging
import os
from datetime import datetime, timedelta
import re
from openai import OpenAI
import tiktoken
import random

from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Default model to use
DEFAULT_MODEL = "gpt-4o"  # This is the current name for GPT-4.5

# Token counting for OpenAI models
def num_tokens_from_string(string: str, model: str = DEFAULT_MODEL) -> int:
    """Returns the number of tokens in a text string."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(string))

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
        
        # Check if this is a subscription query
        is_subscription_query = bool(re.search(r'netflix|hulu|disney|spotify|amazon prime|subscription', message, re.IGNORECASE))
        
        # Check if this is a transaction search query
        is_transaction_query = bool(re.search(r'spend|cost|pay|expense|transaction', message, re.IGNORECASE))
        
        # Process subscription queries with special handling
        if is_subscription_query:
            # Extract mentioned services
            services = []
            for service in ["netflix", "hulu", "disney+", "amazon prime", "spotify"]:
                if re.search(service, message, re.IGNORECASE):
                    services.append(service)
            
            # If no specific services mentioned but subscriptions mentioned, include all
            if not services and "subscription" in message.lower():
                services = ["netflix", "hulu", "disney+", "amazon prime", "spotify"]
            
            # Return initial response to show loading state
            return {
                "response": "I'm analyzing your subscription data...",
                "processingSteps": [
                    {
                        "id": "fetch_subscriptions",
                        "status": "pending",
                        "message": "Fetching your subscription information..."
                    },
                    {
                        "id": "analyze_spending",
                        "status": "pending",
                        "message": "Analyzing your spending patterns..."
                    }
                ],
                "services": services,
                "suggestedQuestions": [
                    "How can I reduce my subscription costs?",
                    "Which streaming service offers the best value?",
                    "What's my total monthly entertainment budget?"
                ]
            }
        
        elif is_transaction_query:
            # Process as a transaction search
            search_results = search_transactions(message, mock_user["id"])
            
            # Generate AI response with transaction data context
            ai_response = generate_ai_response(
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
            ai_response = generate_ai_response(message, mock_user)
            
            return {
                "response": ai_response,
                "suggestedQuestions": generate_suggested_questions(message, ai_response)
            }
    
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

def generate_ai_response(
    message: str, 
    user: Dict[str, Any], 
    transaction_data: Optional[Dict[str, Any]] = None,
    model: str = DEFAULT_MODEL
) -> str:
    """
    Generate an AI response using OpenAI
    """
    try:
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
        - Be encouraging and positive, focusing on progress
        - Keep responses very brief (max 2 short paragraphs)
        - Limit your responses to 100-150 words maximum
        - Format your response with proper markdown:
          - Use bullet points with a dash and space (- item)
          - Use **bold** for important points and headings
          - Use proper line breaks between sections
        - Never recommend specific investment products or make promises about returns
        - Always prioritize building emergency savings and debt reduction before investment advice
        - If the user asks a question unrelated to finance, politely redirect them to financial topics
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
        user_prompt = f"{financial_context}\n\n{transaction_context}\n\nUser: {message}"
        
        # Check token count and truncate if necessary
        token_count = num_tokens_from_string(system_prompt + user_prompt, model)
        max_tokens = 4000  # Safe limit for context
        
        if token_count > max_tokens:
            logger.warning(f"Prompt too long ({token_count} tokens), truncating")
            # Simple truncation strategy
            ratio = max_tokens / token_count
            user_prompt = user_prompt[:int(len(user_prompt) * ratio)]
        
        # For debugging, check if API key is set
        if not settings.OPENAI_API_KEY:
            logger.error("OpenAI API key is not configured")
            return "Error: OpenAI API key is not configured. Please check your environment variables."
        
        # Call OpenAI API with proper error handling
        try:
            logger.info(f"Calling OpenAI API with model: {model}")
            logger.info(f"API Key present: {bool(settings.OPENAI_API_KEY)}")
            logger.info(f"API Key starts with: {settings.OPENAI_API_KEY[:5] if settings.OPENAI_API_KEY else 'None'}...")
            
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            logger.info("OpenAI API call successful")
            return response.choices[0].message.content
            
        except Exception as api_error:
            logger.error(f"OpenAI API error: {str(api_error)}")
            # Fallback response
            return get_fallback_response(message, financial_data, transaction_data)
            
    except Exception as e:
        logger.error(f"Error generating AI response: {str(e)}")
        return "I apologize, but I encountered an error while processing your request. Please try again with a different question."

def get_fallback_response(message: str, financial_data: Dict[str, Any], transaction_data: Optional[Dict[str, Any]] = None) -> str:
    """Generate a fallback response when the API call fails"""
    
    # Simple rule-based responses
    if re.search(r'savings|save', message, re.IGNORECASE):
        return f"Based on your current savings rate of {financial_data['savingsRate']}%, you're doing better than average! To improve further, consider setting up automatic transfers of $225 more each month to your savings account. This would increase your savings rate to 22.8%, putting you on track to build a stronger emergency fund."
    
    elif re.search(r'budget|spending', message, re.IGNORECASE):
        return f"Looking at your spending patterns, your largest expense category is housing at ${financial_data['spendingCategories']['housing']} per month ({round(financial_data['spendingCategories']['housing']/financial_data['income']*100)}% of income). Financial experts typically recommend keeping housing costs under 30% of income. Your food spending is ${financial_data['spendingCategories']['food']}, which is about average. One area you might look at reducing is entertainment at ${financial_data['spendingCategories']['entertainment']} - perhaps try a 'no-spend weekend' challenge?"
    
    elif re.search(r'debt|loan', message, re.IGNORECASE):
        return f"Your current debt-to-income ratio is {financial_data['debtToIncomeRatio'] * 100}%, which is in a healthy range (below 36%). You have ${financial_data['debt']} in total debt. If you allocated an extra $300 per month to debt repayment, you could potentially be debt-free in about 3.5 years, depending on interest rates."
    
    elif re.search(r'emergency fund|emergency savings', message, re.IGNORECASE):
        return f"Financial experts typically recommend having 3-6 months of essential expenses saved in an emergency fund. Based on your monthly expenses of ${financial_data['expenses']}, you should aim for ${financial_data['expenses'] * 3} to ${financial_data['expenses'] * 6} in your emergency fund. At your current savings rate of {financial_data['savingsRate']}%, it would take approximately {round((financial_data['expenses'] * 3) / financial_data['savings'])} months to build a 3-month emergency fund."
    
    elif transaction_data:
        merchants = list(transaction_data['summary']['by_merchant'].keys())
        merchant_str = ", ".join(merchants[:3]) if len(merchants) > 0 else "these services"
        return f"I've analyzed your spending on {merchant_str} over the period from {transaction_data['summary']['time_period']}. You spent a total of ${transaction_data['summary']['total_spent']} on these services. This represents about {round(transaction_data['summary']['total_spent'] / (financial_data['income'] * 3) * 100)}% of your income during this period. Consider reviewing these subscriptions to see if you're getting value from all of them."
    
    else:
        return f"Based on your financial profile, you're doing well with a savings rate of {financial_data['savingsRate']}%. Your monthly income is ${financial_data['income']} and expenses are ${financial_data['expenses']}, leaving you with ${financial_data['savings']} in monthly savings. To improve your financial health further, consider reviewing your spending in entertainment (${financial_data['spendingCategories']['entertainment']}) and other categories (${financial_data['spendingCategories']['other']}) to see if there are opportunities to save more."

def search_transactions(query: str, user_id: int) -> Dict[str, Any]:
    """
    Search transactions based on natural language query
    """
    # Extract time period
    time_period = extract_time_period(query)
    
    # Get mock transaction data, tailored to the query
    all_transactions = get_mock_transactions(user_id, query)
    
    # Analyze query intent using keywords
    query_lower = query.lower()
    query_categories = []
    
    # Map query to specific categories
    category_mapping = {
        "groceries": ["grocery", "groceries", "food", "supermarket", "grocery store"],
        "dining": ["restaurant", "dining", "eat out", "takeout", "food delivery", "cafe", "coffee"],
        "entertainment": ["entertainment", "movie", "streaming", "subscription", "netflix", "hulu", "disney"],
        "transportation": ["gas", "gas station", "uber", "lyft", "transit", "transportation", "car", "fuel"],
        "utilities": ["utility", "utilities", "electric", "water", "internet", "phone", "bill"],
        "shopping": ["shop", "shopping", "amazon", "target", "walmart", "purchase", "buy"]
    }
    
    # Determine which categories the query is about
    for category, keywords in category_mapping.items():
        if any(keyword in query_lower for keyword in keywords):
            query_categories.append(category)
    
    # If no categories detected, try to infer from the query
    if not query_categories:
        # Default to all categories if we can't determine intent
        query_categories = list(category_mapping.keys())
    
    # Filter transactions to only include those from relevant categories
    matching_transactions = []
    for transaction in all_transactions:
        # Check if transaction is within time period
        transaction_date = datetime.strptime(transaction['date'], "%Y-%m-%d")
        if not (time_period[0] <= transaction_date <= time_period[1]):
            continue
        
        # Check if transaction category matches query intent
        category_match = False
        transaction_category = transaction['category'].lower()
        
        for query_category in query_categories:
            if query_category in transaction_category:
                category_match = True
                break
        
        if category_match:
            matching_transactions.append(transaction)
    
    # If we have too many transactions, limit to the most relevant ones
    if len(matching_transactions) > 20:
        # Sort by relevance (for now, just use recency as a proxy for relevance)
        matching_transactions.sort(key=lambda x: x['date'], reverse=True)
        matching_transactions = matching_transactions[:20]
    
    # Aggregate results
    total_spent = sum(t['amount'] for t in matching_transactions)
    by_merchant = {}
    
    # Only include merchants that are relevant to the query
    for t in matching_transactions:
        merchant = t['merchant']
        category = t['category'].lower()
        
        # Check if this merchant's category is relevant to the query
        is_relevant = False
        for query_category in query_categories:
            if query_category in category:
                is_relevant = True
                break
        
        if is_relevant:
            if merchant not in by_merchant:
                by_merchant[merchant] = 0
            by_merchant[merchant] += abs(t['amount'])
    
    # Format time period for display
    time_period_str = f"the last 6 months ({time_period[0].strftime('%b %d, %Y')} to {time_period[1].strftime('%b %d, %Y')})"
    
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
    Extract time period from query, defaulting to last 6 months
    """
    # Default to last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)  # Approximately 6 months
    
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

def get_mock_transactions(user_id: int, query: str = None) -> List[Dict[str, Any]]:
    """
    Generate mock transaction data, optionally tailored to the user's query
    """
    # Start with a base set of transactions
    transactions = []
    
    # Set date range (last 6 months)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # Define common merchant categories
    categories = {
        "groceries": ["Whole Foods", "Trader Joe's", "Safeway", "Kroger", "Albertsons", "Local Grocery", "Costco", "Walmart Grocery", "Target Grocery"],
        "dining": ["Restaurant", "Cafe", "Coffee Shop", "Fast Food", "Food Delivery", "Starbucks", "Chipotle", "Local Diner"],
        "entertainment": ["Netflix", "Hulu", "Disney+", "Spotify", "Amazon Prime", "Movie Theater", "HBO Max", "Apple TV+"],
        "transportation": ["Gas Station", "Shell", "Chevron", "Uber", "Lyft", "Public Transit", "Auto Repair", "ExxonMobil"],
        "utilities": ["Electric Company", "Water Service", "Internet Provider", "Phone Bill", "Gas Company", "Waste Management"],
        "shopping": ["Amazon", "Target", "Walmart", "Department Store", "Online Shopping", "Best Buy", "Home Depot", "Clothing Store"]
    }
    
    # Determine which categories to emphasize based on the query
    emphasized_categories = []
    if query:
        query_lower = query.lower()
        
        # Check for grocery-related terms
        if any(word in query_lower for word in ["grocery", "groceries", "food", "supermarket"]):
            emphasized_categories.append("groceries")
        
        # Check for dining-related terms
        if any(word in query_lower for word in ["restaurant", "dining", "eat out", "takeout", "cafe", "coffee"]):
            emphasized_categories.append("dining")
        
        # Check for entertainment-related terms
        if any(word in query_lower for word in ["netflix", "hulu", "disney", "subscription", "streaming", "entertainment"]):
            emphasized_categories.append("entertainment")
        
        # Check for transportation-related terms
        if any(word in query_lower for word in ["gas", "uber", "lyft", "transit", "transportation", "car", "fuel"]):
            emphasized_categories.append("transportation")
        
        # Check for utility-related terms
        if any(word in query_lower for word in ["utility", "electric", "water", "internet", "phone", "bill"]):
            emphasized_categories.append("utilities")
        
        # Check for shopping-related terms
        if any(word in query_lower for word in ["shop", "amazon", "target", "walmart", "purchase", "buy"]):
            emphasized_categories.append("shopping")
    
    # If no specific categories were identified, include all
    if not emphasized_categories:
        emphasized_categories = list(categories.keys())
    
    # Generate transactions for each category
    for category_name in categories:
        # Determine how many transactions to generate
        # Generate more transactions for emphasized categories, fewer for others
        if category_name in emphasized_categories:
            num_transactions = random.randint(10, 20)  # More transactions for relevant categories
        else:
            num_transactions = random.randint(0, 3)  # Few or no transactions for irrelevant categories
        
        for _ in range(num_transactions):
            # Random date within the range
            days_ago = random.randint(0, 180)
            transaction_date = end_date - timedelta(days=days_ago)
            
            # Random merchant from the category
            merchant = random.choice(categories[category_name])
            
            # Amount based on category
            if category_name == "groceries":
                amount = -random.uniform(30, 150)
            elif category_name == "dining":
                amount = -random.uniform(15, 80)
            elif category_name == "entertainment":
                amount = -random.uniform(10, 30)
            elif category_name == "transportation":
                amount = -random.uniform(20, 100)
            elif category_name == "utilities":
                amount = -random.uniform(50, 200)
            elif category_name == "shopping":
                amount = -random.uniform(20, 150)
            
            # Create transaction
            transactions.append({
                "id": len(transactions) + 1,
                "merchant": merchant,
                "amount": round(amount, 2),
                "category": category_name.capitalize(),
                "date": transaction_date.strftime("%Y-%m-%d"),
                "description": f"Payment to {merchant}"
            })
    
    # Sort by date (newest first)
    transactions.sort(key=lambda x: x['date'], reverse=True)
    
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

@router.get("/test-openai")
async def test_openai():
    """
    Test the OpenAI API connection
    """
    try:
        logger.info(f"Testing OpenAI API connection")
        logger.info(f"API Key present: {bool(settings.OPENAI_API_KEY)}")
        
        if not settings.OPENAI_API_KEY:
            return {"status": "error", "message": "OpenAI API key is not configured"}
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello!"}
            ],
            max_tokens=10
        )
        
        return {
            "status": "success", 
            "message": "OpenAI API connection successful", 
            "response": response.choices[0].message.content
        }
    except Exception as e:
        logger.error(f"Error testing OpenAI API: {str(e)}")
        return {"status": "error", "message": str(e)}

# Add a function to simulate fetching subscription data
def fetch_subscription_data(user_id: int, services: List[str]) -> Dict[str, Any]:
    """
    Simulate fetching subscription data for specific streaming services
    """
    logger.info(f"Fetching subscription data for user {user_id} and services {services}")
    
    # Add a small delay to simulate API call
    import time
    time.sleep(1.5)
    
    # Mock subscription data
    subscriptions = {
        "netflix": {
            "monthly_cost": 15.99,
            "billing_cycle": "monthly",
            "annual_total": 191.88,
            "last_payment_date": (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d")
        },
        "hulu": {
            "monthly_cost": 11.99,
            "billing_cycle": "monthly",
            "annual_total": 143.88,
            "last_payment_date": (datetime.now() - timedelta(days=8)).strftime("%Y-%m-%d")
        },
        "disney+": {
            "monthly_cost": 7.99,
            "billing_cycle": "monthly",
            "annual_total": 95.88,
            "last_payment_date": (datetime.now() - timedelta(days=22)).strftime("%Y-%m-%d")
        },
        "amazon prime": {
            "monthly_cost": 12.99,
            "billing_cycle": "monthly",
            "annual_total": 155.88,
            "last_payment_date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")
        },
        "spotify": {
            "monthly_cost": 9.99,
            "billing_cycle": "monthly",
            "annual_total": 119.88,
            "last_payment_date": (datetime.now() - timedelta(days=12)).strftime("%Y-%m-%d")
        }
    }
    
    # Filter to requested services
    result = {}
    for service in services:
        service_lower = service.lower()
        if service_lower in subscriptions:
            result[service] = subscriptions[service_lower]
    
    return result

@router.post("/subscription-analysis")
async def analyze_subscriptions(
    user_id: int = Body(...),
    services: List[str] = Body(...)
):
    """
    Analyze subscription data for specific services
    """
    try:
        # Fetch subscription data
        subscription_data = fetch_subscription_data(user_id, services)
        
        # Calculate totals
        monthly_total = sum(sub["monthly_cost"] for sub in subscription_data.values())
        annual_total = sum(sub["annual_total"] for sub in subscription_data.values())
        
        # Get user financial data for context
        financial_data = get_mock_financial_data(user_id)
        
        # Calculate percentage of income
        monthly_income_percentage = (monthly_total / financial_data["income"]) * 100
        
        # Generate AI analysis
        analysis_prompt = f"""
        Analyze the following subscription data for a user:
        
        USER FINANCIAL PROFILE:
        - Monthly Income: ${financial_data['income']}
        - Monthly Expenses: ${financial_data['expenses']}
        
        SUBSCRIPTION DATA:
        {json.dumps(subscription_data, indent=2)}
        
        Total monthly subscription cost: ${monthly_total:.2f} (${monthly_income_percentage:.1f}% of monthly income)
        Total annual subscription cost: ${annual_total:.2f}
        
        Provide a helpful analysis of this spending on subscriptions. Is it reasonable? 
        How does it compare to recommended entertainment budget percentages?
        What specific recommendations would you give about these subscriptions?
        """
        
        try:
            # Call OpenAI for analysis
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a financial coach providing subscription spending analysis. Keep responses brief (max 100-150 words) and use bullet points when possible."},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            analysis = response.choices[0].message.content
        except Exception as api_error:
            logger.error(f"OpenAI API error: {str(api_error)}")
            # Fallback analysis
            analysis = f"""
            Based on your subscription data, you're spending ${monthly_total:.2f} per month (${annual_total:.2f} annually) on streaming services.
            
            This represents {monthly_income_percentage:.1f}% of your monthly income. Financial experts typically recommend keeping entertainment expenses to 5-10% of your budget.
            
            Consider evaluating which services you use most frequently and consider rotating subscriptions (subscribing to one service for a month, then switching to another) to reduce costs while still enjoying content.
            """
        
        # Return complete analysis
        return {
            "subscriptionData": subscription_data,
            "analysis": {
                "monthlyTotal": monthly_total,
                "annualTotal": annual_total,
                "percentOfIncome": monthly_income_percentage,
                "recommendations": analysis,
                "cancellationPrompt": "Would you like to cancel any of these subscriptions to save money?"
            },
            "processingSteps": [
                {
                    "id": "fetch_subscriptions",
                    "status": "completed",
                    "message": "Successfully retrieved your subscription information"
                },
                {
                    "id": "analyze_spending",
                    "status": "completed",
                    "message": "Analysis of your spending patterns completed"
                }
            ]
        }
        
    except Exception as e:
        logger.error(f"Error analyzing subscriptions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing subscriptions: {str(e)}")

@router.post("/cancel-subscription")
async def cancel_subscription(
    user_id: int = Body(...),
    subscription: str = Body(...),
):
    """
    Simulate cancelling a subscription
    """
    try:
        logger.info(f"Cancelling subscription {subscription} for user {user_id}")
        
        # Add a delay to simulate the cancellation process
        import time
        time.sleep(2)
        
        # Return success response with savings information
        subscription_data = fetch_subscription_data(user_id, [subscription])
        
        if not subscription_data:
            raise HTTPException(status_code=404, detail="Subscription not found")
            
        monthly_savings = subscription_data[subscription]["monthly_cost"]
        annual_savings = subscription_data[subscription]["annual_total"]
        
        return {
            "status": "success",
            "subscription": subscription,
            "monthlySavings": monthly_savings,
            "annualSavings": annual_savings,
            "message": f"Successfully cancelled your {subscription} subscription"
        }
        
    except Exception as e:
        logger.error(f"Error cancelling subscription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error cancelling subscription: {str(e)}") 