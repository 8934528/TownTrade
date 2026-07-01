from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate


class BusinessService:

    @staticmethod
    def create_business(db: Session, business_data: BusinessCreate, user_id: int) -> Business:
        """Create a new business for a user."""
        # Check if this user already has a business
        existing = db.query(Business).filter(Business.user_id == user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has a registered business"
            )

        db_business = Business(
            user_id=user_id,
            **business_data.model_dump()
        )
        db.add(db_business)
        db.commit()
        db.refresh(db_business)
        return db_business

    @staticmethod
    def get_business_by_id(db: Session, business_id: int) -> Business:
        """Get a business by its ID."""
        business = db.query(Business).filter(Business.id == business_id).first()
        if not business:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business not found"
            )
        return business

    @staticmethod
    def get_business_by_user(db: Session, user_id: int) -> Optional[Business]:
        """Get the business owned by a specific user."""
        return db.query(Business).filter(Business.user_id == user_id).first()

    @staticmethod
    def list_businesses(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        category: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None,
        is_open: Optional[bool] = None,
    ) -> List[Business]:
        """List businesses with optional filters."""
        query = db.query(Business).filter(Business.is_active == True)

        if category:
            query = query.filter(Business.category.ilike(f"%{category}%"))
        if tag:
            query = query.filter(Business.tags.ilike(f"%{tag}%"))
        if search:
            query = query.filter(
                Business.name.ilike(f"%{search}%") |
                Business.description.ilike(f"%{search}%")
            )
        if is_open is not None:
            query = query.filter(Business.is_open == is_open)

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def update_business(db: Session, business_id: int, business_data: BusinessUpdate, user_id: int) -> Business:
        """Update a business. Only the owner can update."""
        business = db.query(Business).filter(
            Business.id == business_id,
            Business.user_id == user_id
        ).first()
        if not business:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business not found or you don't have permission"
            )

        update_data = business_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(business, field, value)

        db.commit()
        db.refresh(business)
        return business

    @staticmethod
    def delete_business(db: Session, business_id: int, user_id: int) -> None:
        """Delete a business. Only the owner can delete."""
        business = db.query(Business).filter(
            Business.id == business_id,
            Business.user_id == user_id
        ).first()
        if not business:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business not found or you don't have permission"
            )
        db.delete(business)
        db.commit()

    @staticmethod
    def tag_business(db: Session, business_id: int, tag: str, user_id: int) -> Business:
        """Add a tag to a business."""
        business = db.query(Business).filter(
            Business.id == business_id,
            Business.user_id == user_id
        ).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")

        existing_tags = [t.strip() for t in (business.tags or "").split(",") if t.strip()]
        if tag not in existing_tags:
            existing_tags.append(tag)
            business.tags = ",".join(existing_tags)
            db.commit()
            db.refresh(business)
        return business


business_service = BusinessService()
