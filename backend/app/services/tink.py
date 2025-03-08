import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from urllib.parse import urlencode

import httpx
from app.core.config import settings


class TinkService:
    """Service for interacting with Tink API"""
    
    def __init__(self):
        self.client_id = settings.TINK_CLIENT_ID
        self.client_secret = settings.TINK_CLIENT_SECRET
        self.redirect_uri = settings.TINK_REDIRECT_URI
        self.base_url = "https://api.tink.com"
        self.auth_url = "https://link.tink.com"
        self.market = "IT"  # Italy
    
    async def get_auth_url(self, state: str = None) -> str:
        """
        Generate authorization URL for Tink Link flow
        
        Args:
            state: Optional state parameter for security
            
        Returns:
            Authorization URL for the user to connect their bank account
        """
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "accounts:read,transactions:read,user:read",
            "market": self.market,
            "locale": "it_IT",
        }
        
        if state:
            params["state"] = state
            
        auth_url = f"{self.auth_url}/1.0/authorize/?{urlencode(params)}"
        return auth_url
    
    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token
        
        Args:
            code: Authorization code received from Tink
            
        Returns:
            Dictionary containing access_token, refresh_token, and expires_at
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/oauth/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to exchange code for token: {response.text}")
                
            data = response.json()
            expires_at = datetime.now() + timedelta(seconds=data.get("expires_in", 3600))
            
            return {
                "access_token": data.get("access_token"),
                "refresh_token": data.get("refresh_token"),
                "expires_at": expires_at
            }
    
    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh an expired access token
        
        Args:
            refresh_token: The refresh token to use
            
        Returns:
            Dictionary containing new access_token, refresh_token, and expires_at
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/oauth/token",
                data={
                    "grant_type": "refresh_token",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "refresh_token": refresh_token
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to refresh token: {response.text}")
                
            data = response.json()
            expires_at = datetime.now() + timedelta(seconds=data.get("expires_in", 3600))
            
            return {
                "access_token": data.get("access_token"),
                "refresh_token": data.get("refresh_token"),
                "expires_at": expires_at
            }
    
    async def get_accounts(self, access_token: str) -> List[Dict[str, Any]]:
        """
        Get user's bank accounts
        
        Args:
            access_token: Tink access token
            
        Returns:
            List of bank accounts
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/data/v2/accounts",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get accounts: {response.text}")
                
            data = response.json()
            return data.get("accounts", [])
    
    async def get_transactions(
        self,
        access_token: str,
        account_id: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get transactions for a specific account or all accounts
        
        Args:
            access_token: Tink access token
            account_id: Optional account ID to get transactions for
            from_date: Optional start date in YYYY-MM-DD format
            to_date: Optional end date in YYYY-MM-DD format
            
        Returns:
            List of transactions
        """
        params = {}
        if account_id:
            params["accountIdIn"] = account_id
        if from_date:
            params["bookedDateFrom"] = from_date
        if to_date:
            params["bookedDateTo"] = to_date
            
        query_string = f"?{urlencode(params)}" if params else ""
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/data/v2/transactions{query_string}",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get transactions: {response.text}")
                
            data = response.json()
            return data.get("transactions", [])
    
    async def identify_subscriptions(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identify potential subscriptions from transaction data
        
        Args:
            transactions: List of transactions
            
        Returns:
            List of identified subscriptions
        """
        # Group transactions by description and similar amounts
        subscriptions = {}
        
        for transaction in transactions:
            description = transaction.get("descriptions", {}).get("display", "").lower()
            amount = transaction.get("amount", {}).get("value", {}).get("unscaledValue")
            currency = transaction.get("amount", {}).get("currencyCode")
            
            if not description or not amount:
                continue
                
            # Skip deposits
            if amount > 0:
                continue
                
            key = f"{description}_{abs(amount)}_{currency}"
            
            if key not in subscriptions:
                subscriptions[key] = {
                    "description": description,
                    "amount": abs(amount) / 100,  # Convert from minor units
                    "currency": currency,
                    "occurrences": [],
                    "frequency": "unknown"
                }
                
            subscriptions[key]["occurrences"].append(transaction.get("dates", {}).get("booked"))
        
        # Filter out transactions with less than 2 occurrences
        result = []
        for key, sub in subscriptions.items():
            if len(sub["occurrences"]) >= 2:
                # Sort occurrences by date
                sub["occurrences"].sort()
                
                # Try to determine frequency
                if len(sub["occurrences"]) >= 3:
                    # Calculate average days between payments
                    days_between = []
                    for i in range(1, len(sub["occurrences"])):
                        date1 = datetime.fromisoformat(sub["occurrences"][i-1].replace("Z", "+00:00"))
                        date2 = datetime.fromisoformat(sub["occurrences"][i].replace("Z", "+00:00"))
                        days = (date2 - date1).days
                        days_between.append(days)
                    
                    avg_days = sum(days_between) / len(days_between)
                    
                    # Determine frequency
                    if 25 <= avg_days <= 35:
                        sub["frequency"] = "monthly"
                    elif 6 <= avg_days <= 8:
                        sub["frequency"] = "weekly"
                    elif 13 <= avg_days <= 15:
                        sub["frequency"] = "bi-weekly"
                    elif 85 <= avg_days <= 95:
                        sub["frequency"] = "quarterly"
                    elif 350 <= avg_days <= 380:
                        sub["frequency"] = "yearly"
                
                result.append(sub)
        
        return result         return result 