from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Any

from app.database import get_db
from app.services.user_service import user_service
from app.services.auth_service import auth_service
from app.schemas.user import User, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    return auth_service.get_current_user(db, token)


@router.get("/me", response_model=User)
def get_my_profile(current_user=Depends(get_current_user)) -> Any:
    """Get the current authenticated user's profile."""
    return current_user


@router.put("/me", response_model=User)
def update_my_profile(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> Any:
    """Update the current user's profile."""
    return user_service.update_user(db, current_user.id, user_in)


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)) -> Any:
    """Get a user by ID (public profile)."""
    return user_service.get_user_by_id(db, user_id)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_account(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> None:
    """Delete the current user's account."""
    user_service.delete_user(db, current_user.id)
