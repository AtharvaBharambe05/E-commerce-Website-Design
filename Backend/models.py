from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config.databaseconfig import Base
import enum

class OrderStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    shipped = "shipped"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    cancelled = "cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    is_prime = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    addresses = relationship("Address", back_populates="user", cascade="all, delete")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete")
    orders = relationship("Order", back_populates="user", cascade="all, delete")
    wishlist = relationship("WishlistItem", back_populates="user", cascade="all, delete")

class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    line1 = Column(String, nullable=False)
    line2 = Column(String, nullable=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip = Column(String, nullable=False)
    country = Column(String, default="USA")
    phone = Column(String, nullable=True)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    image = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    is_prime = Column(Boolean, default=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    in_stock = Column(Boolean, default=True)

    cart_items = relationship("CartItem", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    color = Column(String, nullable=True)
    storage = Column(String, nullable=True)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_number = Column(String, unique=True, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(SAEnum(OrderStatus), default=OrderStatus.pending)
    delivery_option = Column(String, nullable=True)
    address_snapshot = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_name = Column(String, nullable=False)
    product_image = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    color = Column(String, nullable=True)
    storage = Column(String, nullable=True)

    order = relationship("Order", back_populates="items")

class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    user = relationship("User", back_populates="wishlist")
    product = relationship("Product", back_populates="wishlist_items")
