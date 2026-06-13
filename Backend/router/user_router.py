from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.databaseconfig import get_db
import models, schemas, auth

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/profile", response_model=schemas.UserOut)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.UserOut)
def update_profile(
    body: schemas.UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if body.name:
        current_user.name = body.name
    if body.phone:
        current_user.phone = body.phone
    db.commit()
    db.refresh(current_user)
    return current_user
