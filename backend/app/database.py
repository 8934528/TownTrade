from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create PostgreSQL engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,       # Verify connections before using
    pool_size=10,              # Connection pool size
    max_overflow=20,           # Extra connections beyond pool_size
    echo=settings.DEBUG,       # Log SQL in debug mode
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all SQLAlchemy models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session per request.
    Automatically closes the session when the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize the database: create all tables if they don't exist.
    Called automatically on backend startup.
    """
    # Import all models here so SQLAlchemy knows about them before create_all
    from app.models import user, business, product, order, payment, message  # noqa: F401

    logger.info("Initializing PostgreSQL database — creating tables if not exist...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables ready.")
