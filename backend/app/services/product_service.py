from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:

    @staticmethod
    def create_product(db: Session, product_data: ProductCreate, business_id: int) -> Product:
        """Create a new product for a business."""
        db_product = Product(
            business_id=business_id,
            **product_data.model_dump()
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def get_product_by_id(db: Session, product_id: int) -> Product:
        """Get a product by its ID."""
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product

    @staticmethod
    def list_products_by_business(
        db: Session,
        business_id: int,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        active_only: bool = True,
    ) -> List[Product]:
        """List all products for a specific business."""
        query = db.query(Product).filter(Product.business_id == business_id)
        if active_only:
            query = query.filter(Product.is_active == True)
        if category:
            query = query.filter(Product.category.ilike(f"%{category}%"))
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def list_all_products(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[Product]:
        """List all active products across businesses."""
        query = db.query(Product).filter(Product.is_active == True)
        if category:
            query = query.filter(Product.category.ilike(f"%{category}%"))
        if search:
            query = query.filter(
                Product.name.ilike(f"%{search}%") |
                Product.description.ilike(f"%{search}%")
            )
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def update_product(
        db: Session,
        product_id: int,
        product_data: ProductUpdate,
        business_id: int,
    ) -> Product:
        """Update a product. Only the owning business can update."""
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.business_id == business_id
        ).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or you don't have permission"
            )

        update_data = product_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)

        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def delete_product(db: Session, product_id: int, business_id: int) -> None:
        """Delete a product. Only the owning business can delete."""
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.business_id == business_id
        ).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or you don't have permission"
            )
        db.delete(product)
        db.commit()

    @staticmethod
    def update_stock(db: Session, product_id: int, delta: int, business_id: int) -> Product:
        """Increment or decrement product stock."""
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.business_id == business_id
        ).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        new_stock = max(0, product.stock + delta)
        product.stock = new_stock
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def get_low_stock_products(db: Session, business_id: int) -> List[Product]:
        """Get products that are at or below their low stock threshold."""
        products = db.query(Product).filter(
            Product.business_id == business_id,
            Product.is_active == True,
            Product.stock <= Product.low_stock_threshold
        ).all()
        return products


product_service = ProductService()
