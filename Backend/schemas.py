from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth ---
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- User ---
class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    is_prime: bool
    created_at: datetime
    class Config: from_attributes = True

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

# --- Address ---
class AddressCreate(BaseModel):
    name: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    zip: str
    country: str = "USA"
    phone: Optional[str] = None
    is_default: bool = False

class AddressOut(AddressCreate):
    id: int
    class Config: from_attributes = True

# --- Product ---
class ProductOut(BaseModel):
    id: int
    name: str
    brand: str
    price: float
    original_price: Optional[float]
    rating: float
    review_count: int
    image: Optional[str]
    badge: Optional[str]
    is_prime: bool
    category: Optional[str]
    description: Optional[str]
    in_stock: bool
    class Config: from_attributes = True

class ProductListResponse(BaseModel):
    products: List[ProductOut]
    total: int
    page: int
    page_size: int

# --- Cart ---
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    color: Optional[str] = None
    storage: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    color: Optional[str]
    storage: Optional[str]
    product: ProductOut
    class Config: from_attributes = True

# --- Order ---
class OrderItemOut(BaseModel):
    id: int
    product_name: str
    product_image: Optional[str]
    price: float
    quantity: int
    color: Optional[str]
    storage: Optional[str]
    class Config: from_attributes = True

class OrderOut(BaseModel):
    id: int
    order_number: str
    total: float
    status: str
    delivery_option: Optional[str]
    address_snapshot: Optional[str]
    created_at: datetime
    items: List[OrderItemOut]
    class Config: from_attributes = True

class CreateOrderRequest(BaseModel):
    address_id: int
    delivery_option: str
    payment_method: str

# --- Wishlist ---
class WishlistItemOut(BaseModel):
    id: int
    product: ProductOut
    class Config: from_attributes = True
