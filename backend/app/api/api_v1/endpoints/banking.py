from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

router = APIRouter()

@router.get("/connect")
async def connect_bank():
    """
    Start TrueLayer bank connection flow.
    """
    return {"message": "Bank connection flow will be implemented here"}

@router.get("/accounts")
async def get_accounts():
    """
    Get user's connected bank accounts.
    """
    return {"message": "Connected accounts will be returned here"}

@router.get("/transactions")
async def get_transactions():
    """
    Get user's transactions.
    """
    return {"message": "Transactions will be returned here"}

@router.get("/subscriptions")
async def get_subscriptions():
    """
    Get user's subscriptions.
    """
    return {"message": "Subscriptions will be returned here"} 