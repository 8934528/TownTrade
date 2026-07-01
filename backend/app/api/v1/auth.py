from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any

from app import schemas
from app.database import get_db
from app.services.auth_service import auth_service, oauth2_scheme

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """Register a new user (role: 'customer' or 'business')."""
    user = auth_service.register_user(db, user_in)
    return user


@router.post("/login", response_model=schemas.Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Login with email and password. Returns JWT tokens and user info."""
    user = auth_service.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )

    tokens = auth_service.create_user_tokens(user)
    auth_service.update_last_login(db, user)

    return {
        **tokens,
        "user": schemas.User.model_validate(user)
    }


@router.post("/refresh", response_model=schemas.Token)
def refresh_token(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    """Refresh the access token using a valid refresh token."""
    return auth_service.refresh_token(db, token)


@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)) -> Any:
    """Logout the current user (client should discard the token)."""
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=schemas.User)
def read_users_me(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    """Get the currently authenticated user's info."""
    current_user = auth_service.get_current_user(db, token)
    return current_user
