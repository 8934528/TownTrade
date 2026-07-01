from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.services.business_service import business_service
from app.services.product_service import product_service
from app.services.auth_service import auth_service
from app.schemas.business import Business, BusinessCreate, BusinessUpdate, BusinessSummary
from app.schemas.product import Product

router = APIRouter(prefix="/businesses", tags=["businesses"])


def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    return auth_service.get_current_user(db, token)


@router.get("/", response_model=List[BusinessSummary])
def list_businesses(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    is_open: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """List businesses with optional filters."""
    return business_service.list_businesses(db, skip, limit, category, tag, search, is_open)


@router.post("/", response_model=Business, status_code=status.HTTP_201_CREATED)
def create_business(
    business_in: BusinessCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new business (business role required)."""
    if current_user.role != "business":
        raise HTTPException(status_code=403, detail="Only business users can create a business")
    return business_service.create_business(db, business_in, current_user.id)


@router.get("/me", response_model=Business)
def get_my_business(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get the logged-in user's business profile."""
    business = business_service.get_business_by_user(db, current_user.id)
    if not business:
        raise HTTPException(status_code=404, detail="No business found for this user")
    return business


@router.get("/{business_id}", response_model=Business)
def get_business(business_id: int, db: Session = Depends(get_db)):
    """Get a specific business by ID."""
    return business_service.get_business_by_id(db, business_id)


@router.put("/{business_id}", response_model=Business)
def update_business(
    business_id: int,
    business_in: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update a business (owner only)."""
    return business_service.update_business(db, business_id, business_in, current_user.id)


@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_business(
    business_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Delete a business (owner only)."""
    business_service.delete_business(db, business_id, current_user.id)


@router.get("/{business_id}/products", response_model=List[Product])
def list_business_products(
    business_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all products for a specific business."""
    return product_service.list_products_by_business(db, business_id, skip, limit, category)


@router.post("/{business_id}/tag", response_model=Business)
def add_tag_to_business(
    business_id: int,
    tag: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Add a tag to a business (owner only)."""
    return business_service.tag_business(db, business_id, tag, current_user.id)
