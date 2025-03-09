from app.api.api_v1.endpoints import (
    auth,
    pdf_analysis,
    savings_opportunities,
    users,
    utils,
)
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(
    pdf_analysis.router, prefix="/pdf-analysis", tags=["pdf-analysis"]
)
api_router.include_router(
    savings_opportunities.router,
    prefix="/savings-opportunities",
    tags=["savings-opportunities"],
)
