import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from urllib.parse import urlencode

import httpx
from app.core.config import settings


class TrueLayerService:
    """Service for interacting with TrueLayer API"""

    def __init__(self):
        self.client_id = settings.TRUELAYER_CLIENT_ID
        self.client_secret = settings.TRUELAYER_CLIENT_SECRET
        self.redirect_uri = settings.TRUELAYER_REDIRECT_URI
        # Use live URLs instead of sandbox
        self.auth_url = "https://auth.truelayer.com"
        self.api_url = "https://api.truelayer.com"

    async def get_auth_url(self, state: str = None) -> str:
        """
        Generate authorization URL for TrueLayer OAuth flow

        Args:
            state: Optional state parameter for security

        Returns:
            Authorization URL for the user to connect their bank account
        """
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "info accounts balance cards transactions direct_debits standing_orders offline_access",
            "providers": "it-ob-all it-oauth-all",  # Italian banks (Open Banking and OAuth)
        }

        if state:
            params["state"] = state

        auth_url = f"{self.auth_url}/?{urlencode(params)}"
        return auth_url

    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token

        Args:
            code: Authorization code received from TrueLayer

        Returns:
            Dictionary containing access_token, refresh_token, and expires_at
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.auth_url}/connect/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "redirect_uri": self.redirect_uri,
                    "code": code,
                },
            )

            if response.status_code != 200:
                raise Exception(f"Failed to exchange code for token: {response.text}")

            data = response.json()
            expires_at = datetime.now() + timedelta(seconds=data["expires_in"])

            return {
                "access_token": data["access_token"],
                "refresh_token": data["refresh_token"],
                "expires_at": expires_at,
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
                f"{self.auth_url}/connect/token",
                data={
                    "grant_type": "refresh_token",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "refresh_token": refresh_token,
                },
            )

            if response.status_code != 200:
                raise Exception(f"Failed to refresh token: {response.text}")

            data = response.json()
            expires_at = datetime.now() + timedelta(seconds=data["expires_in"])

            return {
                "access_token": data["access_token"],
                "refresh_token": data["refresh_token"],
                "expires_at": expires_at,
            }

    async def get_accounts(self, access_token: str) -> List[Dict[str, Any]]:
        """
        Get user's bank accounts

        Args:
            access_token: TrueLayer access token

        Returns:
            List of bank accounts
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/data/v1/accounts",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            if response.status_code != 200:
                raise Exception(f"Failed to get accounts: {response.text}")

            data = response.json()
            return data.get("results", [])

    async def get_transactions(
        self,
        access_token: str,
        account_id: str,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get transactions for a specific account

        Args:
            access_token: TrueLayer access token
            account_id: Account ID to get transactions for
            from_date: Optional start date in YYYY-MM-DD format
            to_date: Optional end date in YYYY-MM-DD format

        Returns:
            List of transactions
        """
        params = {}
        if from_date:
            params["from"] = from_date
        if to_date:
            params["to"] = to_date

        query_string = f"?{urlencode(params)}" if params else ""

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/data/v1/accounts/{account_id}/transactions{query_string}",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            if response.status_code != 200:
                raise Exception(f"Failed to get transactions: {response.text}")

            data = response.json()
            return data.get("results", [])

    async def get_standing_orders(
        self, access_token: str, account_id: str
    ) -> List[Dict[str, Any]]:
        """
        Get standing orders for a specific account

        Args:
            access_token: TrueLayer access token
            account_id: Account ID to get standing orders for

        Returns:
            List of standing orders
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/data/v1/accounts/{account_id}/standing_orders",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            if response.status_code != 200:
                raise Exception(f"Failed to get standing orders: {response.text}")

            data = response.json()
            return data.get("results", [])

    async def get_direct_debits(
        self, access_token: str, account_id: str
    ) -> List[Dict[str, Any]]:
        """
        Get direct debits for a specific account

        Args:
            access_token: TrueLayer access token
            account_id: Account ID to get direct debits for

        Returns:
            List of direct debits
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_url}/data/v1/accounts/{account_id}/direct_debits",
                headers={"Authorization": f"Bearer {access_token}"},
            )

            if response.status_code != 200:
                raise Exception(f"Failed to get direct debits: {response.text}")

            data = response.json()
            return data.get("results", [])

    async def identify_subscriptions(
        self, transactions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Identify potential subscriptions from transaction data

        Args:
            transactions: List of transactions

        Returns:
            List of identified subscriptions
        """
        # This is a simplified implementation
        # In a real-world scenario, you would use more sophisticated algorithms
        # to identify recurring payments with similar amounts and descriptions

        # Group transactions by description and similar amounts
        subscriptions = {}

        for transaction in transactions:
            description = transaction.get("description", "").lower()
            amount = transaction.get("amount")

            if not description or not amount:
                continue

            # Skip deposits
            if amount > 0:
                continue

            key = f"{description}_{round(abs(amount), 2)}"

            if key not in subscriptions:
                subscriptions[key] = {
                    "description": description,
                    "amount": abs(amount),
                    "occurrences": [],
                    "frequency": "unknown",
                }

            subscriptions[key]["occurrences"].append(transaction.get("timestamp"))

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
                        date1 = datetime.fromisoformat(
                            sub["occurrences"][i - 1].replace("Z", "+00:00")
                        )
                        date2 = datetime.fromisoformat(
                            sub["occurrences"][i].replace("Z", "+00:00")
                        )
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

        return result
