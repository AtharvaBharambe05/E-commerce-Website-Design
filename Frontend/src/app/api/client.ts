const BASE_URL = "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isAuthRoute = path.startsWith("/auth/");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isAuthRoute && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Auth ---
export const api = {
  auth: {
    signup: (name: string, email: string, password: string) =>
      request<{ access_token: string }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ access_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    verifyOtp: (email: string, otp: string) =>
      request<{ message: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }),
    resetPassword: (email: string, otp: string, new_password: string) =>
      request<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, new_password }),
      }),
  },

  user: {
    getProfile: () => request<UserProfile>("/user/profile"),
    updateProfile: (data: { name?: string; phone?: string }) =>
      request<UserProfile>("/user/profile", { method: "PUT", body: JSON.stringify(data) }),
  },

  products: {
    list: (params: ProductParams = {}) => {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
      return request<ProductListResponse>(`/products?${q}`);
    },
    get: (id: number) => request<Product>(`/products/${id}`),
  },

  cart: {
    get: () => request<CartItem[]>("/cart"),
    add: (product_id: number, quantity = 1, color?: string, storage?: string) =>
      request<CartItem>("/cart", {
        method: "POST",
        body: JSON.stringify({ product_id, quantity, color, storage }),
      }),
    update: (item_id: number, quantity: number) =>
      request<CartItem>(`/cart/${item_id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      }),
    remove: (item_id: number) =>
      request<{ message: string }>(`/cart/${item_id}`, { method: "DELETE" }),
    clear: () => request<{ message: string }>("/cart", { method: "DELETE" }),
  },

  orders: {
    list: () => request<Order[]>("/orders"),
    get: (id: number) => request<Order>(`/orders/${id}`),
    place: (address_id: number, delivery_option: string, payment_method: string) =>
      request<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({ address_id, delivery_option, payment_method }),
      }),
  },

  addresses: {
    list: () => request<Address[]>("/addresses"),
    add: (data: AddressCreate) =>
      request<Address>("/addresses", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: AddressCreate) =>
      request<Address>(`/addresses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<{ message: string }>(`/addresses/${id}`, { method: "DELETE" }),
  },

  wishlist: {
    get: () => request<WishlistItem[]>("/wishlist"),
    add: (product_id: number) => request<WishlistItem>(`/wishlist/${product_id}`, { method: "POST" }),
    remove: (product_id: number) =>
      request<{ message: string }>(`/wishlist/${product_id}`, { method: "DELETE" }),
  },
};

// --- Types ---
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_prime: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  image: string | null;
  badge: string | null;
  is_prime: boolean;
  category: string | null;
  description: string | null;
  in_stock: boolean;
}

export interface ProductParams {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  is_prime?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  color: string | null;
  storage: string | null;
  product: Product;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  color: string | null;
  storage: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  delivery_option: string | null;
  address_snapshot: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface Address {
  id: number;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

export type AddressCreate = Omit<Address, "id">;

export interface WishlistItem {
  id: number;
  product: Product;
}
