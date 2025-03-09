from app.api.api_v1.endpoints import (
    banking,
    challenges,
    coach,
    progress,
    savings_planner,
    statement_analysis,
    users,
)
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(challenges.router, prefix="/challenges", tags=["challenges"])
api_router.include_router(banking.router, prefix="/banking", tags=["banking"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(coach.router, prefix="/coach", tags=["coach"])
api_router.include_router(
    statement_analysis.router, prefix="/statement-analysis", tags=["statement-analysis"]
)
api_router.include_router(
    savings_planner.router, prefix="/savings-planner", tags=["savings-planner"]
)
