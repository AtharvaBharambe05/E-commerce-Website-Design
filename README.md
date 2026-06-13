# ShopNest E-commerce

Full-stack e-commerce app built with **FastAPI** (backend) and **React + Vite** (frontend).

---

## Project Structure

```
E-commerce Website Design/
├── Backend/
│   ├── config/              # Database config
│   ├── router/              # API route handlers
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT auth helpers
│   ├── seed.py              # Database seeder
│   ├── server.py            # FastAPI app entry point
│   ├── requirement.txt      # Python dependencies
│   ├── .env                 # Environment variables
│   └── ShopNest_API.postman_collection.json
└── Frontend/
    ├── src/
    │   ├── app/
    │   │   ├── api/         # API client (client.ts)
    │   │   ├── components/  # Reusable UI components
    │   │   └── pages/       # Page components
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## Backend Setup

### Requirements
- Python 3.10+
- PostgreSQL (or Supabase)

### Install & Run

```bash
cd Backend
pip install -r requirement.txt
uvicorn server:app --reload --port 8000
```

API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Environment Variables (`.env`)

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
```

### Seed Database

```bash
cd Backend
python seed.py
```

---

## Frontend Setup

### Requirements
- Node.js 18+

### Install & Run

```bash
cd Frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`

---

## API Reference

Base URL: `http://localhost:8000`

Protected routes require header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT token |
| POST | `/auth/forgot-password` | No | Send OTP to email |
| POST | `/auth/verify-otp` | No | Verify OTP code |
| POST | `/auth/reset-password` | No | Reset password with OTP |

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/profile` | Yes | Get current user profile |
| PUT | `/user/profile` | Yes | Update name / phone |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | No | List products (filterable) |
| GET | `/products/{id}` | No | Get product by ID |

**Query params for listing:** `category`, `brand`, `min_price`, `max_price`, `min_rating`, `is_prime`, `search`, `sort`, `page`, `page_size`

**Sort values:** `featured`, `price-asc`, `price-desc`, `rating`, `newest`

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | Yes | Get cart items |
| POST | `/cart` | Yes | Add item to cart |
| PUT | `/cart/{item_id}` | Yes | Update item quantity |
| DELETE | `/cart/{item_id}` | Yes | Remove item |
| DELETE | `/cart` | Yes | Clear entire cart |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders` | Yes | List user orders |
| GET | `/orders/{id}` | Yes | Get order by ID |
| POST | `/orders` | Yes | Place order from cart |

**Delivery options:** `standard` (free), `express` ($9.99), `same-day` ($19.99)

### Addresses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/addresses` | Yes | List saved addresses |
| POST | `/addresses` | Yes | Add new address |
| PUT | `/addresses/{id}` | Yes | Update address |
| DELETE | `/addresses/{id}` | Yes | Delete address |

### Wishlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/wishlist` | Yes | Get wishlist items |
| POST | `/wishlist/{product_id}` | Yes | Add product to wishlist |
| DELETE | `/wishlist/{product_id}` | Yes | Remove from wishlist |

---

## Postman Collection

Import `Backend/ShopNest_API.postman_collection.json` into Postman.

The Login request automatically saves the token to the `token` collection variable, so all protected requests are authenticated instantly after login.
