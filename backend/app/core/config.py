import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SavQuest"

    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./savquest.db")

    # TrueLayer API settings
    TRUELAYER_CLIENT_ID: str = os.getenv("TRUELAYER_CLIENT_ID", "")
    TRUELAYER_CLIENT_SECRET: str = os.getenv("TRUELAYER_CLIENT_SECRET", "")
    TRUELAYER_REDIRECT_URI: str = os.getenv(
        "TRUELAYER_REDIRECT_URI", "http://localhost:8000/api/v1/banking/callback"
    )

    # Tink API settings
    TINK_CLIENT_ID: str = os.getenv("TINK_CLIENT_ID", "")
    TINK_CLIENT_SECRET: str = os.getenv("TINK_CLIENT_SECRET", "")
    TINK_REDIRECT_URI: str = os.getenv(
        "TINK_REDIRECT_URI", "http://localhost:8000/api/v1/banking/tink-callback"
    )

    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days


settings = Settings()
