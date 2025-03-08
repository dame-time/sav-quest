from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class BankAccountResponse(BaseModel):
    """Schema for bank account response"""

    account_id: str
    account_type: str
    display_name: Optional[str] = None
    currency: str
    account_number: Optional[Dict[str, Any]] = None
    provider: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    """Schema for transaction response"""

    transaction_id: str
    timestamp: datetime
    description: str
    amount: float
    currency: str
    transaction_type: Optional[str] = None
    transaction_category: Optional[str] = None
    merchant_name: Optional[str] = None
    running_balance: Optional[Dict[str, Any]] = None
    meta: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class SubscriptionResponse(BaseModel):
    """Schema for subscription response"""

    description: str
    amount: float
    frequency: str
    occurrences: List[str]

    class Config:
        from_attributes = True
