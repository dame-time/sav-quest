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
from app.services.truelayer import TrueLayerService
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

router = APIRouter()
truelayer_service = TrueLayerService()


@router.get("/connect", response_class=RedirectResponse)
async def connect_bank(
    request: Request, current_user: User = Depends(get_current_user)
):
    """
    Start TrueLayer bank connection flow.

    This endpoint redirects the user to TrueLayer's authorization page
    where they can select their bank and authorize access.
    """
    # Generate a unique state parameter to prevent CSRF attacks
    state = str(uuid.uuid4())

    # Store the state in the session or database for verification later
    request.session["truelayer_state"] = state
    request.session["user_id"] = current_user.id

    # Generate the authorization URL
    auth_url = await truelayer_service.get_auth_url(state=state)

    # Redirect the user to TrueLayer's authorization page
    return RedirectResponse(auth_url)


@router.get("/callback")
async def truelayer_callback(
    code: str = Query(...),
    state: str = Query(...),
    request: Request = None,
    db: Session = Depends(get_db),
):
    """
    Handle callback from TrueLayer after user authorizes access.

    This endpoint exchanges the authorization code for an access token
    and stores the token in the database.
    """
    # Verify the state parameter to prevent CSRF attacks
    if request.session.get("truelayer_state") != state:
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
        token_data = await truelayer_service.exchange_code_for_token(code)

        # Store the token in the database
        bank_connection = BankConnection(
            user_id=user_id,
            provider="truelayer",
            access_token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            expires_at=token_data["expires_at"],
            is_active=True,
        )

        db.add(bank_connection)
        db.commit()
        db.refresh(bank_connection)

        # Clear the session
        request.session.pop("truelayer_state", None)
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
            BankConnection.user_id == current_user.id, BankConnection.is_active == True
        )
        .first()
    )

    if not bank_connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active bank connection found",
        )

    # Check if the token is expired and refresh if needed
    if bank_connection.expires_at <= datetime.now():
        try:
            token_data = await truelayer_service.refresh_access_token(
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

    # Get the accounts from TrueLayer
    try:
        accounts = await truelayer_service.get_accounts(bank_connection.access_token)
        return accounts

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get accounts: {str(e)}",
        )


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    account_id: str = Query(...),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get user's transactions for a specific account.
    """
    # Get the user's active bank connection
    bank_connection = (
        db.query(BankConnection)
        .filter(
            BankConnection.user_id == current_user.id, BankConnection.is_active == True
        )
        .first()
    )

    if not bank_connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active bank connection found",
        )

    # Check if the token is expired and refresh if needed
    if bank_connection.expires_at <= datetime.now():
        try:
            token_data = await truelayer_service.refresh_access_token(
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

    # Get the transactions from TrueLayer
    try:
        transactions = await truelayer_service.get_transactions(
            bank_connection.access_token, account_id, from_date, to_date
        )
        return transactions

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transactions: {str(e)}",
        )


@router.get("/subscriptions", response_model=List[SubscriptionResponse])
async def get_subscriptions(
    account_id: str = Query(...),
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
            BankConnection.user_id == current_user.id, BankConnection.is_active == True
        )
        .first()
    )

    if not bank_connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active bank connection found",
        )

    # Check if the token is expired and refresh if needed
    if bank_connection.expires_at <= datetime.now():
        try:
            token_data = await truelayer_service.refresh_access_token(
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
        # Get transactions from TrueLayer
        transactions = await truelayer_service.get_transactions(
            bank_connection.access_token, account_id, from_date
        )

        # Identify subscriptions from transactions
        subscriptions = await truelayer_service.identify_subscriptions(transactions)

        return subscriptions

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get subscriptions: {str(e)}",
        )
