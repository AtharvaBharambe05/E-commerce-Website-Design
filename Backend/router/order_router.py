from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.databaseconfig import get_db
import models, schemas, auth
import uuid, json

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=List[schemas.OrderOut])
def get_orders(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id, models.Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("", response_model=schemas.OrderOut)
def place_order(
    body: schemas.CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    address = db.query(models.Address).filter(
        models.Address.id == body.address_id,
        models.Address.user_id == current_user.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    delivery_costs = {"standard": 0, "express": 9.99, "same-day": 19.99}
    delivery_cost = delivery_costs.get(body.delivery_option, 0)
    subtotal = sum(i.product.price * i.quantity for i in cart_items)
    tax = subtotal * 0.08
    total = subtotal + delivery_cost + tax

    order_number = f"SNS-{uuid.uuid4().hex[:10].upper()}"
    addr_data = json.dumps({
        "name": address.name, "line1": address.line1,
        "city": address.city, "state": address.state, "zip": address.zip
    })

    order = models.Order(
        user_id=current_user.id,
        order_number=order_number,
        total=round(total, 2),
        delivery_option=body.delivery_option,
        address_snapshot=addr_data,
        status=models.OrderStatus.pending
    )
    db.add(order)
    db.flush()

    for ci in cart_items:
        db.add(models.OrderItem(
            order_id=order.id,
            product_id=ci.product_id,
            product_name=ci.product.name,
            product_image=ci.product.image,
            price=ci.product.price,
            quantity=ci.quantity,
            color=ci.color,
            storage=ci.storage
        ))

    # Clear cart after order
    db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order
