from fastapi import APIRouter

from app.api.api_v1.endpoints import users, challenges, banking, progress

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(challenges.router, prefix="/challenges", tags=["challenges"])
api_router.include_router(banking.router, prefix="/banking", tags=["banking"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"]) 