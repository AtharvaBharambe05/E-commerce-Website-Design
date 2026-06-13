from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from config.databaseconfig import get_db
import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Auth"])

# In-memory OTP store (use Redis in production)
otp_store: dict = {}

@router.post("/signup", response_model=schemas.TokenResponse)
def signup(body: schemas.SignupRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        name=body.name,
        email=body.email,
        hashed_password=auth.hash_password(body.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": auth.create_access_token(user.id)}

@router.post("/login", response_model=schemas.TokenResponse)
def login(body: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not auth.verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": auth.create_access_token(user.id)}

@router.post("/forgot-password")
def forgot_password(body: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    # In production, send email with real OTP
    otp_store[body.email] = "123456"
    return {"message": "OTP sent to email"}

@router.post("/verify-otp")
def verify_otp(body: schemas.VerifyOTPRequest):
    stored = otp_store.get(body.email)
    if not stored or stored != body.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "OTP verified"}

@router.post("/reset-password")
def reset_password(body: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    stored = otp_store.get(body.email)
    if not stored or stored != body.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = auth.hash_password(body.new_password)
    db.commit()
    otp_store.pop(body.email, None)
    return {"message": "Password reset successfully"}
