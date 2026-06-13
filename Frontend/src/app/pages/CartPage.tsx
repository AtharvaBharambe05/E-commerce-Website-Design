import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, Plus, Minus, Heart, Tag, Shield, Truck, Lock, ChevronRight, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import { api } from "../api/client";
import type { CartItem as ApiCartItem } from "../api/client";

interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  isPrime: boolean;
  color: string;
  storage?: string;
  inStock: boolean;
}

const initialCartItems: CartItem[] = [
  { id: 1, name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", brand: "Apple", price: 1199.99, originalPrice: 1399.99, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=300&h=300&fit=crop&auto=format", quantity: 1, isPrime: true, color: "Natural Titanium", storage: "256GB", inStock: true },
  { id: 3, name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", brand: "Sony", price: 279.99, originalPrice: 399.99, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&auto=format", quantity: 1, isPrime: true, color: "Black", inStock: true },
  { id: 5, name: "Nike Air Max 270 React Running Shoes", brand: "Nike", price: 89.99, originalPrice: 129.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&auto=format", quantity: 2, isPrime: true, color: "White/Black", inStock: true },
];

const recommended: Product[] = [
  { id: 7, name: "Apple Watch Series 9 GPS 45mm", brand: "Apple", price: 399.99, originalPrice: 499.99, rating: 4.8, reviewCount: 9876, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 11, name: "Bose QuietComfort 45 Headphones", brand: "Bose", price: 199.99, originalPrice: 329.99, rating: 4.6, reviewCount: 15432, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 4, name: "MacBook Air 15-inch M3", brand: "Apple", price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviewCount: 5432, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 6, name: "Instant Pot Duo 7-in-1 Pressure Cooker", brand: "Instant Pot", price: 59.99, originalPrice: 99.99, rating: 4.7, reviewCount: 65432, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format", isPrime: true },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [apiCartItems, setApiCartItems] = useState<ApiCartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.cart.get().then(cartItems => {
        setApiCartItems(cartItems);
        setItems(cartItems.map(ci => ({
          id: ci.id,
          name: ci.product.name,
          brand: ci.product.brand,
          price: ci.product.price,
          originalPrice: ci.product.original_price ?? ci.product.price,
          image: ci.product.image ?? "",
          quantity: ci.quantity,
          isPrime: ci.product.is_prime,
          color: ci.color ?? "",
          storage: ci.storage ?? undefined,
          inStock: ci.product.in_stock,
        })));
      }).catch(() => {});
    }
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    const token = localStorage.getItem("token");
    if (token) api.cart.update(id, newQty).catch(() => {});
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    const token = localStorage.getItem("token");
    if (token) api.cart.remove(id).catch(() => {});
  };

  const saveForLater = (id: number) => {
    setSavedItems(prev => [...prev, id]);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savings = originalTotal - subtotal;
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 25 ? 0 : 5.99;
  const tax = (subtotal - couponDiscount) * 0.08;
  const total = subtotal - couponDiscount + shipping + tax;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10");
      setCouponApplied(false);
    }
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center max-w-md w-full">
          <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
          <button
            className="bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold py-3 px-8 rounded-full transition-colors"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-[#007185]">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0F1111] font-medium">Shopping Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Cart items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-bold text-[#0F1111]">Shopping Cart</h1>
                <span className="text-gray-500 text-sm">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
              </div>

              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 py-5 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-medium text-sm text-[#0F1111] hover:text-[#C7511F] cursor-pointer line-clamp-2 mb-1"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">{item.brand} · {item.color}{item.storage ? ` · ${item.storage}` : ""}</p>
                          {item.isPrime && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[#00A8CC] font-black text-xs italic">prime</span>
                            </div>
                          )}
                          {item.inStock ? (
                            <p className="text-[#067D62] text-xs font-medium mt-0.5">In Stock</p>
                          ) : (
                            <p className="text-[#CC0C39] text-xs font-medium mt-0.5">Out of Stock</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-[#0F1111]">₹{(item.price * item.quantity).toFixed(2)}</div>
                          {item.quantity > 1 && <div className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</div>}
                          {item.originalPrice > item.price && (
                            <div className="text-xs text-[#CC0C39] font-medium">
                              Save ₹{((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold border-x border-gray-200 h-8 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs">
                          <button
                            className="text-[#007185] hover:text-[#C7511F] px-2 py-1 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            className="text-[#007185] hover:text-[#C7511F] px-2 py-1 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
                            onClick={() => saveForLater(item.id)}
                          >
                            <Heart className="w-3.5 h-3.5" /> Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {items.length > 0 && (
                <div className="pt-4 flex justify-end">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-[#0F1111]">
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):
                      <span className="font-bold ml-2">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-[#CC0C39] font-medium">You save: ₹{savings.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24 space-y-4">
              <h2 className="font-bold text-[#0F1111] text-lg">Order Summary</h2>

              {/* Coupon */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FF9900] transition-colors"
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-[#067D62] mt-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> SAVE10 applied — 10% off!
                  </p>
                )}
                {couponError && <p className="text-xs text-[#CC0C39] mt-1">{couponError}</p>}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#CC0C39]">
                    <span>Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-[#067D62]">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Coupon SAVE10</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-[#067D62]" : ""}>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Order Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full py-3.5 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-full transition-all hover:shadow-md text-sm"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <div className="flex flex-col gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#067D62]" />
                  <span>Secure SSL encrypted payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#067D62]" />
                  <span>Free shipping on orders over ₹25</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#067D62]" />
                  <span>100% buyer protection guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended products */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#0F1111] mb-4">Customers Who Bought This Also Bought</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommended.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
