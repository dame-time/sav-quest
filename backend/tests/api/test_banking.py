from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from app.api.deps import get_current_user
from app.main import app
from app.models.bank_connection import BankConnection
from app.models.user import User
from fastapi.testclient import TestClient

client = TestClient(app)

# Mock user for testing
mock_user = User(
    id=1,
    email="test@example.com",
    username="testuser",
    hashed_password="hashed_password",
    is_active=True,
)

# Mock bank connection for testing
mock_bank_connection = BankConnection(
    id=1,
    user_id=1,
    provider="truelayer",
    access_token="mock_access_token",
    refresh_token="mock_refresh_token",
    expires_at=datetime.now() + timedelta(hours=1),
    is_active=True,
)

# Mock TrueLayer responses
mock_accounts = [
    {
        "account_id": "acc_123",
        "account_type": "TRANSACTION",
        "display_name": "Current Account",
        "currency": "GBP",
        "account_number": {"iban": "GB123456789"},
        "provider": {"display_name": "Mock Bank"},
    }
]

mock_transactions = [
    {
        "transaction_id": "tx_123",
        "timestamp": datetime.now().isoformat(),
        "description": "Coffee Shop",
        "amount": -3.50,
        "currency": "GBP",
        "transaction_type": "DEBIT",
        "transaction_category": "PURCHASE",
    }
]

mock_subscriptions = [
    {
        "description": "netflix",
        "amount": 9.99,
        "frequency": "monthly",
        "occurrences": [
            (datetime.now() - timedelta(days=30)).isoformat(),
            datetime.now().isoformat(),
        ],
    }
]


# Test authentication and dependency overrides
async def override_get_current_user():
    return mock_user


def override_get_db():
    # This would normally return a database session
    # For testing, we'll use mocks instead
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = mock_bank_connection
    return db


# Override dependencies
app.dependency_overrides[get_current_user] = override_get_current_user
app.dependency_overrides["app.db.database.get_db"] = override_get_db


@pytest.mark.asyncio
@patch("app.services.truelayer.TrueLayerService.get_auth_url")
async def test_connect_bank(mock_get_auth_url):
    """Test the bank connection endpoint"""
    # Mock the auth URL
    mock_get_auth_url.return_value = "https://auth.truelayer.com/mock-auth-url"

    # Make the request
    response = client.get("/api/v1/banking/connect")

    # Check that we got redirected
    assert response.status_code == 307
    assert response.headers["location"] == "https://auth.truelayer.com/mock-auth-url"


@pytest.mark.asyncio
@patch("app.services.truelayer.TrueLayerService.get_accounts")
async def test_get_accounts(mock_get_accounts):
    """Test the get accounts endpoint"""
    # Mock the accounts response
    mock_get_accounts.return_value = mock_accounts

    # Make the request
    response = client.get("/api/v1/banking/accounts")

    # Check the response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["account_id"] == "acc_123"
    assert data[0]["currency"] == "GBP"


@pytest.mark.asyncio
@patch("app.services.truelayer.TrueLayerService.get_transactions")
async def test_get_transactions(mock_get_transactions):
    """Test the get transactions endpoint"""
    # Mock the transactions response
    mock_get_transactions.return_value = mock_transactions

    # Make the request
    response = client.get("/api/v1/banking/transactions?account_id=acc_123")

    # Check the response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["description"] == "Coffee Shop"
    assert data[0]["amount"] == -3.50


@pytest.mark.asyncio
@patch("app.services.truelayer.TrueLayerService.get_transactions")
@patch("app.services.truelayer.TrueLayerService.identify_subscriptions")
async def test_get_subscriptions(mock_identify_subscriptions, mock_get_transactions):
    """Test the get subscriptions endpoint"""
    # Mock the transactions and subscriptions responses
    mock_get_transactions.return_value = mock_transactions
    mock_identify_subscriptions.return_value = mock_subscriptions

    # Make the request
    response = client.get("/api/v1/banking/subscriptions?account_id=acc_123")

    # Check the response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["description"] == "netflix"
    assert data[0]["amount"] == 9.99
    assert data[0]["frequency"] == "monthly"
