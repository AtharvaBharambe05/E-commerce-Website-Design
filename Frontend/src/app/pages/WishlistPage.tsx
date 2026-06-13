import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Heart, ShoppingCart, Trash2, Share2, Plus, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";

interface WishItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  addedDate: string;
}

const initialWishlist: WishItem[] = [
  { id: 1, name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", brand: "Apple", price: 1199.99, originalPrice: 1399.99, rating: 4.8, reviews: 12453, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=300&h=300&fit=crop&auto=format", inStock: true, addedDate: "Dec 15, 2024" },
  { id: 3, name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", brand: "Sony", price: 279.99, originalPrice: 399.99, rating: 4.9, reviews: 34521, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&auto=format", inStock: true, addedDate: "Dec 10, 2024" },
  { id: 4, name: "MacBook Air 15-inch M3 8GB RAM 256GB SSD", brand: "Apple", price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviews: 5432, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&auto=format", inStock: true, addedDate: "Nov 28, 2024" },
  { id: 9, name: "Dyson V15 Detect Cordless Vacuum Cleaner", brand: "Dyson", price: 449.99, originalPrice: 749.99, rating: 4.8, reviews: 8765, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format", inStock: false, addedDate: "Nov 20, 2024" },
  { id: 5, name: "Nike Air Max 270 React Running Shoes", brand: "Nike", price: 89.99, originalPrice: 129.99, rating: 4.6, reviews: 18765, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&auto=format", inStock: true, addedDate: "Nov 15, 2024" },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(initialWishlist);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);
  const [shareToast, setShareToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.wishlist.get().then(wishItems => {
        setItems(wishItems.map(w => ({
          id: w.product.id,
          name: w.product.name,
          brand: w.product.brand,
          price: w.product.price,
          originalPrice: w.product.original_price ?? w.product.price,
          rating: w.product.rating,
          reviews: w.product.review_count,
          image: w.product.image ?? "",
          inStock: w.product.in_stock,
          addedDate: "Recently",
        })));
      }).catch(() => {});
    }
  }, []);

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    const token = localStorage.getItem("token");
    if (token) api.wishlist.remove(id).catch(() => {});
  };

  const handleAddToCart = (id: number) => {
    setAddedToCart(prev => [...prev, id]);
    const token = localStorage.getItem("token");
    if (token) api.cart.add(id).catch(() => {});
    setTimeout(() => setAddedToCart(prev => prev.filter(i => i !== id)), 2000);
  };

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center max-w-md w-full">
          <Heart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and revisit them anytime.</p>
          <button className="bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold py-3 px-8 rounded-full transition-colors" onClick={() => navigate("/products")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalSavings = items.reduce((sum, i) => sum + (i.originalPrice - i.price), 0);

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#131921] text-white text-sm px-5 py-3 rounded-full shadow-xl z-50"
          >
            ✓ Wishlist link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-[#007185]">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0F1111] font-medium">Wishlist</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#0F1111] flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#CC0C39] fill-current" />
              My Wishlist
              <span className="text-gray-400 font-normal text-lg">({items.length})</span>
            </h1>
            {totalSavings > 0 && (
              <p className="text-sm text-[#067D62] font-medium mt-0.5">
                You're saving ₹{totalSavings.toFixed(2)} on wishlisted items
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] px-4 py-2 rounded-full text-sm font-bold transition-colors"
              onClick={() => navigate("/products")}
            >
              <Plus className="w-4 h-4" /> Add Items
            </button>
          </div>
        </div>

        {/* Move all to cart */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-5 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {items.filter(i => i.inStock).length} of {items.length} items are in stock
          </div>
          <button
            className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] px-5 py-2 rounded-full text-sm font-bold transition-colors"
            onClick={() => items.filter(i => i.inStock).forEach(i => handleAddToCart(i.id))}
          >
            <ShoppingCart className="w-4 h-4" /> Add All to Cart
          </button>
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map(item => {
              const discountPct = Math.round((1 - item.price / item.originalPrice) * 100);
              const isInCart = addedToCart.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div
                    className="relative bg-gray-50 aspect-square cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    {discountPct > 0 && (
                      <span className="absolute top-3 left-3 bg-[#CC0C39] text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{discountPct}%
                      </span>
                    )}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    <button
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                      onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                    >
                      <Trash2 className="w-4 h-4 text-[#CC0C39]" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="text-xs text-[#007185] mb-0.5">{item.brand}</div>
                    <h3
                      className="text-sm font-medium text-[#0F1111] line-clamp-2 mb-2 cursor-pointer hover:text-[#C7511F]"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(item.rating) ? "fill-[#FFA41C] text-[#FFA41C]" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({item.reviews.toLocaleString()})</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-lg font-bold text-[#0F1111]">₹{item.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</span>
                    </div>

                    <div className="text-xs text-gray-400 mb-3">Added {item.addedDate}</div>

                    <button
                      className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        !item.inStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isInCart
                          ? "bg-[#067D62] text-white"
                          : "bg-[#FF9900] hover:bg-[#E88B00] text-[#131921]"
                      }`}
                      onClick={() => item.inStock && handleAddToCart(item.id)}
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {!item.inStock ? "Out of Stock" : isInCart ? "Added to Cart!" : "Add to Cart"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
