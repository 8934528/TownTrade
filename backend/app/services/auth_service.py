from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.schemas.token import Token
from app.core import security
from app.core.config import settings

# OAuth2 scheme — shared across all API routers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class AuthService:

    # Expose oauth2_scheme as an instance attribute for use in other modules
    oauth2_scheme = oauth2_scheme

    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:
        """Register a new user."""
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        hashed_password = security.get_password_hash(user_data.password)

        db_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            role=user_data.role,
            phone=user_data.phone,
            is_active=True,
            is_verified=False,
            created_at=datetime.utcnow()
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password."""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not security.verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_user_tokens(user: User) -> dict:
        """Create access and refresh tokens for a user."""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        access_token = security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
        refresh_token = security.create_refresh_token(
            user.id, expires_delta=refresh_token_expires
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    def update_last_login(db: Session, user: User) -> None:
        """Update the user's last login timestamp."""
        user.last_login = datetime.utcnow()
        db.commit()

    @staticmethod
    def get_current_user(db: Session, token: str) -> User:
        """Decode JWT token and return the current user."""
        payload = security.decode_token(token)
        if not payload or payload.get('type') != 'access':
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )

        return user

    @staticmethod
    def refresh_token(db: Session, refresh_token: str) -> dict:
        """Refresh access token using a valid refresh token."""
        payload = security.decode_token(refresh_token)
        if not payload or payload.get('type') != 'refresh':
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = security.create_access_token(
            user.id, expires_delta=access_token_expires
        )

        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }


auth_service = AuthService()
