from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.databaseconfig import Base, engine
from router import auth_router, user_router, product_router, cart_router, order_router, address_router, wishlist_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopNest API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(product_router.router)
app.include_router(cart_router.router)
app.include_router(order_router.router)
app.include_router(address_router.router)
app.include_router(wishlist_router.router)

@app.get("/")
def root():
    return {"message": "ShopNest API is running"}
