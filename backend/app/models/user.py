from app.db.database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Financial traits levels
    saver_level = Column(Integer, default=1)
    investor_level = Column(Integer, default=1)
    budgeter_level = Column(Integer, default=1)
    scholar_level = Column(Integer, default=1)

    # Streak information
    current_streak = Column(Integer, default=0)
    last_activity_date = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    bank_connections = relationship("BankConnection", back_populates="user")
