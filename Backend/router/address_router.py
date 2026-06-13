from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.databaseconfig import get_db
import models, schemas, auth

router = APIRouter(prefix="/addresses", tags=["Addresses"])

@router.get("", response_model=List[schemas.AddressOut])
def get_addresses(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Address).filter(models.Address.user_id == current_user.id).all()

@router.post("", response_model=schemas.AddressOut)
def add_address(
    body: schemas.AddressCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if body.is_default:
        db.query(models.Address).filter(models.Address.user_id == current_user.id).update({"is_default": False})
    address = models.Address(user_id=current_user.id, **body.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.put("/{address_id}", response_model=schemas.AddressOut)
def update_address(
    address_id: int,
    body: schemas.AddressCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    address = db.query(models.Address).filter(
        models.Address.id == address_id,
        models.Address.user_id == current_user.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    if body.is_default:
        db.query(models.Address).filter(models.Address.user_id == current_user.id).update({"is_default": False})
    for k, v in body.model_dump().items():
        setattr(address, k, v)
    db.commit()
    db.refresh(address)
    return address

@router.delete("/{address_id}")
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    address = db.query(models.Address).filter(
        models.Address.id == address_id,
        models.Address.user_id == current_user.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(address)
    db.commit()
    return {"message": "Address deleted"}
