from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TownTrade API",
    description="Backend API for TownTrade — Township Business Platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS middleware — must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup."""
    logger.info("Starting TownTrade API...")
    from app.database import init_db
    init_db()
    logger.info("TownTrade API is ready.")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("TownTrade API shutting down.")


@app.get("/")
async def root():
    return {
        "message": "Welcome to TownTrade API",
        "version": "2.0.0",
        "docs": "/api/docs",
        "status": "operational",
        "database": "PostgreSQL",
    }


@app.get("/health")
async def health_check():
    try:
        from app.database import engine
        with engine.connect() as conn:
            conn.execute(__import__('sqlalchemy').text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "version": "2.0.0",
    }
