"""Run once to seed initial products: python seed.py"""
from config.databaseconfig import SessionLocal, Base, engine
import models

Base.metadata.create_all(bind=engine)

products = [
    {"name": "Apple iPhone 15 Pro Max 256GB Natural Titanium", "brand": "Apple", "price": 1199.99, "original_price": 1399.99, "rating": 4.8, "review_count": 12453, "image": "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=400&h=400&fit=crop&auto=format", "badge": "Best Seller", "is_prime": True, "category": "Electronics", "in_stock": True},
    {"name": "Samsung Galaxy S24 Ultra 512GB Titanium Black", "brand": "Samsung", "price": 1099.99, "original_price": 1299.99, "rating": 4.7, "review_count": 8765, "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&auto=format", "badge": "Deal", "is_prime": True, "category": "Electronics", "in_stock": True},
    {"name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones", "brand": "Sony", "price": 279.99, "original_price": 399.99, "rating": 4.9, "review_count": 34521, "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format", "badge": "Best Seller", "is_prime": True, "category": "Electronics", "in_stock": True},
    {"name": "MacBook Air 15-inch M3 Chip 8GB RAM 256GB SSD", "brand": "Apple", "price": 1299.99, "original_price": 1499.99, "rating": 4.8, "review_count": 5432, "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format", "badge": None, "is_prime": True, "category": "Computers", "in_stock": True},
    {"name": "Nike Air Max 270 React Running Shoes", "brand": "Nike", "price": 89.99, "original_price": 129.99, "rating": 4.6, "review_count": 18765, "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", "badge": "New", "is_prime": True, "category": "Sports", "in_stock": True},
    {"name": "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Quart", "brand": "Instant Pot", "price": 59.99, "original_price": 99.99, "rating": 4.7, "review_count": 65432, "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format", "badge": "Deal", "is_prime": True, "category": "Home & Kitchen", "in_stock": True},
    {"name": "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case", "brand": "Apple", "price": 399.99, "original_price": 499.99, "rating": 4.8, "review_count": 9876, "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format", "badge": None, "is_prime": True, "category": "Electronics", "in_stock": True},
    {"name": "Levi's 501 Original Fit Men's Jeans", "brand": "Levi's", "price": 49.99, "original_price": 69.99, "rating": 4.5, "review_count": 45678, "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format", "badge": None, "is_prime": True, "category": "Clothing", "in_stock": True},
    {"name": "Dyson V15 Detect Cordless Vacuum Cleaner", "brand": "Dyson", "price": 449.99, "original_price": 749.99, "rating": 4.8, "review_count": 8765, "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format", "badge": "Deal", "is_prime": True, "category": "Home & Kitchen", "in_stock": True},
    {"name": "Kindle Paperwhite E-reader 16GB Signature Edition", "brand": "Amazon", "price": 139.99, "original_price": 189.99, "rating": 4.7, "review_count": 23456, "image": "https://images.unsplash.com/photo-1512614094824-6a9baac8e4b0?w=400&h=400&fit=crop&auto=format", "badge": "Deal", "is_prime": True, "category": "Electronics", "in_stock": True},
    {"name": "Bose QuietComfort 45 Bluetooth Wireless Headphones", "brand": "Bose", "price": 199.99, "original_price": 329.99, "rating": 4.6, "review_count": 15432, "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", "badge": "Deal", "is_prime": True, "category": "Electronics", "in_stock": True},
    {"name": "Adidas Ultraboost 23 Running Shoes Men's", "brand": "Adidas", "price": 119.99, "original_price": 189.99, "rating": 4.7, "review_count": 12765, "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format", "badge": None, "is_prime": True, "category": "Sports", "in_stock": True},
]

db = SessionLocal()
try:
    if db.query(models.Product).count() == 0:
        for p in products:
            db.add(models.Product(**p))
        db.commit()
        print(f"Seeded {len(products)} products.")
    else:
        print("Products already seeded.")
finally:
    db.close()
