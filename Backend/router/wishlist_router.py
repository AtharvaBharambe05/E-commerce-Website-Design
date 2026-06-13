from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.databaseconfig import get_db
import models, schemas, auth

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[schemas.WishlistItemOut])
def get_wishlist(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.WishlistItem).filter(models.WishlistItem.user_id == current_user.id).all()

@router.post("/{product_id}", response_model=schemas.WishlistItemOut)
def add_to_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == current_user.id,
        models.WishlistItem.product_id == product_id
    ).first()
    if existing:
        return existing
    item = models.WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    item = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == current_user.id,
        models.WishlistItem.product_id == product_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not in wishlist")
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}
