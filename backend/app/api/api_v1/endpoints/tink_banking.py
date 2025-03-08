import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.bank_connection import BankConnection
from app.models.user import User
from app.schemas.banking import (
    BankAccountResponse,
    SubscriptionResponse,
    TransactionResponse,
)
from app.services.tink import TinkService
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

router = APIRouter()
tink_service = TinkService()


@router.get("/connect", response_class=RedirectResponse)
async def connect_bank(
    request: Request, current_user: User = Depends(get_current_user)
):
    """
    Start Tink bank connection flow.

    This endpoint redirects the user to Tink's authorization page
    where they can select their bank and authorize access.
    """
    # Generate a unique state parameter to prevent CSRF attacks
    state = str(uuid.uuid4())

    # Store the state in the session or database for verification later
    request.session["tink_state"] = state
    request.session["user_id"] = current_user.id

    # Generate the authorization URL
    auth_url = await tink_service.get_auth_url(state=state)

    # Redirect the user to Tink's authorization page
    return RedirectResponse(auth_url)


@router.get("/callback")
async def tink_callback(
    code: str = Query(...),
    state: str = Query(...),
    request: Request = None,
    db: Session = Depends(get_db),
):
    """
    Handle callback from Tink after user authorizes access.

    This endpoint exchanges the authorization code for an access token
    and stores the token in the database.
    """
    # Verify the state parameter to prevent CSRF attacks
    if request.session.get("tink_state") != state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter"
        )

    # Get the user ID from the session
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated"
        )

    try:
        # Exchange the authorization code for an access token
        token_data = await tink_service.exchange_code_for_token(code)

        # Store the token in the database
        bank_connection = BankConnection(
            user_id=user_id,
            provider="tink",
            access_token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            expires_at=token_data["expires_at"],
            is_active=True,
        )

        db.add(bank_connection)
        db.commit()
        db.refresh(bank_connection)

        # Clear the session
        request.session.pop("tink_state", None)
        request.session.pop("user_id", None)

        # Redirect to a success page
        return RedirectResponse("/banking/success")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect bank account: {str(e)}",
        )


@router.get("/accounts", response_model=List[BankAccountResponse])
async def get_accounts(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Get user's connected bank accounts.
    """
    # Get the user's active bank connection
    bank_connection = (
        db.query(BankConnection)
        .filter(
            BankConnection.user_id == current_user.id,
            BankConnection.provider == "tink",
            BankConnection.is_active == True,
        )
        .first()
    )

    if not bank_connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active Tink bank connection found",
        )

    # Check if the token is expired and refresh if needed
    if bank_connection.expires_at <= datetime.now():
        try:
            token_data = await tink_service.refresh_access_token(
                bank_connection.refresh_token
            )

            bank_connection.access_token = token_data["access_token"]
            bank_connection.refresh_token = token_data["refresh_token"]
            bank_connection.expires_at = token_data["expires_at"]

            db.commit()
            db.refresh(bank_connection)

        except Exception as e:
            # If token refresh fails, mark the connection as inactive
            bank_connection.is_active = False
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bank connection expired. Please reconnect your bank account.",
            )

    # Get the accounts from Tink
    try:
        accounts = await tink_service.get_accounts(bank_connection.access_token)

        # Transform Tink accounts to our schema
        transformed_accounts = []
        for account in accounts:
            transformed_accounts.append(
                {
                    "account_id": account.get("id", ""),
                    "account_type": account.get("type", ""),
                    "display_name": account.get("name", ""),
                    "currency": account.get("currencyCode", ""),
                    "account_number": {
                        "iban": account.get("identifiers", {}).get("iban", "")
                    },
                    "provider": {
                        "display_name": account.get("financialInstitution", {}).get(
                            "name", ""
                        )
                    },
                }
            )

        return transformed_accounts

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get accounts: {str(e)}",
        )


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    account_id: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get user's transactions for a specific account or all accounts.
    """
    # Get the user's active bank connection
    bank_connection = (
        db.query(BankConnection)
        .filter(
            BankConnection.user_id == current_user.id,
            BankConnection.provider == "tink",
            BankConnection.is_active == True,
        )
        .first()
    )

    if not bank_connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active Tink bank connection found",
        )

    # Check if the token is expired and refresh if needed
    if bank_connection.expires_at <= datetime.now():
        try:
            token_data = await tink_service.refresh_access_token(
                bank_connection.refresh_token
            )

            bank_connection.access_token = token_data["access_token"]
            bank_connection.refresh_token = token_data["refresh_token"]
            bank_connection.expires_at = token_data["expires_at"]

            db.commit()
            db.refresh(bank_connection)

        except Exception as e:
            # If token refresh fails, mark the connection as inactive
            bank_connection.is_active = False
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bank connection expired. Please reconnect your bank account.",
            )

    # Get the transactions from Tink
    try:
        transactions = await tink_service.get_transactions(
            bank_connection.access_token, account_id, from_date, to_date
        )

        # Transform Tink transactions to our schema
        transformed_transactions = []
        for tx in transactions:
            transformed_transactions.append(
                {
                    "transaction_id": tx.get("id", ""),
                    "timestamp": tx.get("dates", {}).get("booked", ""),
                    "description": tx.get("descriptions", {}).get("display", ""),
                    "amount": tx.get("amount", {})
                    .get("value", {})
                    .get("unscaledValue", 0)
                    / 100,  # Convert from minor units
                    "currency": tx.get("amount", {}).get("currencyCode", ""),
                    "transaction_type": tx.get("type", ""),
                    "transaction_category": (
                        tx.get("categories", [{}])[0].get("name", "")
                        if tx.get("categories")
                        else ""
                    ),
                    "merchant_name": tx.get("merchantInformation", {}).get("name", ""),
                    "meta": tx,
                }
            )

        return transformed_transactions

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transactions: {str(e)}",
        )


@router.get("/subscriptions", response_model=List[SubscriptionResponse])
async def get_subscriptions(
    account_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get user's subscriptions based on transaction history.
    """
    # Get the user's active bank connection
    bank_connection = (
        db.query(BankConnection)
        .filter(
            BankConnection.user_id == current_user.id,
            BankConnection.provider == "tink",
            BankConnection.is_active == True,
        )
        .first()
    )

    if not bank_connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active Tink bank connection found",
        )

    # Check if the token is expired and refresh if needed
    if bank_connection.expires_at <= datetime.now():
        try:
            token_data = await tink_service.refresh_access_token(
                bank_connection.refresh_token
            )

            bank_connection.access_token = token_data["access_token"]
            bank_connection.refresh_token = token_data["refresh_token"]
            bank_connection.expires_at = token_data["expires_at"]

            db.commit()
            db.refresh(bank_connection)

        except Exception as e:
            # If token refresh fails, mark the connection as inactive
            bank_connection.is_active = False
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bank connection expired. Please reconnect your bank account.",
            )

    # Get transactions for the last 6 months
    from_date = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%d")

    try:
        # Get transactions from Tink
        transactions = await tink_service.get_transactions(
            bank_connection.access_token, account_id, from_date
        )

        # Identify subscriptions from transactions
        subscriptions = await tink_service.identify_subscriptions(transactions)

        return subscriptions

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get subscriptions: {str(e)}",
        )
