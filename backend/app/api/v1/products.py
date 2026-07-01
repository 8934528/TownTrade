from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.services.product_service import product_service
from app.services.business_service import business_service
from app.services.auth_service import auth_service
from app.schemas.product import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_service.oauth2_scheme)):
    return auth_service.get_current_user(db, token)


@router.get("/", response_model=List[Product])
def list_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all active products across businesses."""
    return product_service.list_all_products(db, skip, limit, category, search)


@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new product (business users only)."""
    if current_user.role != "business":
        raise HTTPException(status_code=403, detail="Only business users can create products")

    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=404, detail="You must register a business first")

    return product_service.create_product(db, product_in, my_business.id)


@router.get("/low-stock", response_model=List[Product])
def get_low_stock_products(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get products with low stock (business only)."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=404, detail="No business found")
    return product_service.get_low_stock_products(db, my_business.id)


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID."""
    return product_service.get_product_by_id(db, product_id)


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update a product (business owner only)."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=404, detail="No business found")
    return product_service.update_product(db, product_id, product_in, my_business.id)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Delete a product (business owner only)."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=404, detail="No business found")
    product_service.delete_product(db, product_id, my_business.id)


@router.patch("/{product_id}/stock", response_model=Product)
def update_product_stock(
    product_id: int,
    delta: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Adjust product stock by delta (positive to add, negative to subtract)."""
    my_business = business_service.get_business_by_user(db, current_user.id)
    if not my_business:
        raise HTTPException(status_code=404, detail="No business found")
    return product_service.update_stock(db, product_id, delta, my_business.id)
