from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from config.databaseconfig import get_db
import models, schemas

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=schemas.ProductListResponse)
def list_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    is_prime: Optional[bool] = None,
    search: Optional[str] = None,
    sort: str = "featured",
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    q = db.query(models.Product)
    if category:
        q = q.filter(models.Product.category.ilike(f"%{category}%"))
    if brand:
        q = q.filter(models.Product.brand.ilike(f"%{brand}%"))
    if min_price is not None:
        q = q.filter(models.Product.price >= min_price)
    if max_price is not None:
        q = q.filter(models.Product.price <= max_price)
    if min_rating is not None:
        q = q.filter(models.Product.rating >= min_rating)
    if is_prime is not None:
        q = q.filter(models.Product.is_prime == is_prime)
    if search:
        q = q.filter(models.Product.name.ilike(f"%{search}%"))

    sort_map = {
        "price-asc": models.Product.price.asc(),
        "price-desc": models.Product.price.desc(),
        "rating": models.Product.rating.desc(),
        "newest": models.Product.id.desc(),
    }
    q = q.order_by(sort_map.get(sort, models.Product.id.asc()))

    total = q.count()
    products = q.offset((page - 1) * page_size).limit(page_size).all()
    return {"products": products, "total": total, "page": page, "page_size": page_size}

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product
