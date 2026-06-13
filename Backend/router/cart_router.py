from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.databaseconfig import get_db
import models, schemas, auth

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("", response_model=List[schemas.CartItemOut])
def get_cart(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()

@router.post("", response_model=schemas.CartItemOut)
def add_to_cart(
    body: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == body.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == current_user.id,
        models.CartItem.product_id == body.product_id,
        models.CartItem.color == body.color,
        models.CartItem.storage == body.storage
    ).first()

    if existing:
        existing.quantity += body.quantity
        db.commit()
        db.refresh(existing)
        return existing

    item = models.CartItem(user_id=current_user.id, **body.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=schemas.CartItemOut)
def update_cart_item(
    item_id: int,
    body: schemas.CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    item.quantity = body.quantity
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed"}

@router.delete("")
def clear_cart(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
