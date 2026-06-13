import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, ShoppingCart, Star, Eye, Zap } from "lucide-react";
import { motion } from "motion/react";

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  isPrime?: boolean;
  category?: string;
  discount?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1,2,3,4,5].map(star => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ₹{star <= Math.round(rating) ? "fill-[#FFA41C] text-[#FFA41C]" : "text-gray-300"}`}
          />
        ))}
      </div>
      <span className="text-xs text-[#007185] hover:text-[#C7511F] cursor-pointer">
        ({count.toLocaleString()})
      </span>
    </div>
  );
}

export function ProductCard({ product, view = "grid", onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedToCart(true);
    onAddToCart?.(product);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onAddToWishlist?.(product);
  };

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : product.discount ?? 0;

  if (view === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex gap-4 p-4 border border-transparent hover:border-[#FF9900]/30"
        onClick={() => navigate(`/product/₹{product.id}`)}
      >
        <div className="relative w-40 h-40 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain transition-opacity duration-300 ₹{imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          {discountPct > 0 && (
            <span className="absolute top-2 left-2 bg-[#CC0C39] text-white text-xs font-bold px-1.5 py-0.5 rounded">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[#007185] mb-1">{product.brand}</div>
          <h3 className="font-medium text-sm text-[#0F1111] line-clamp-2 mb-2">{product.name}</h3>
          <StarRating rating={product.rating} count={product.reviewCount} />
          {product.isPrime && (
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[#00A8CC] font-black text-xs italic">prime</span>
              <span className="text-xs text-gray-500">Free delivery</span>
            </div>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#0F1111]">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.inStock !== false ? (
            <p className="text-xs text-[#067D62] font-medium mt-1">In Stock</p>
          ) : (
            <p className="text-xs text-[#CC0C39] font-medium mt-1">Out of Stock</p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ₹{
                addedToCart
                  ? "bg-[#067D62] text-white"
                  : "bg-[#FF9900] hover:bg-[#E88B00] text-[#131921]"
              }`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? "Added!" : "Add to Cart"}
            </button>
            <button
              className={`p-2 rounded-full border transition-all ₹{
                wishlisted ? "border-[#CC0C39] text-[#CC0C39] bg-red-50" : "border-gray-200 text-gray-400 hover:border-[#CC0C39] hover:text-[#CC0C39]"
              }`}
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ₹{wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-transparent hover:border-[#FF9900]/20 relative"
      onClick={() => navigate(`/product/₹{product.id}`)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.badge && (
          <span className={`text-white text-xs font-bold px-2 py-0.5 rounded shadow ₹{
            product.badge === "Best Seller" ? "bg-[#CC0C39]" :
            product.badge === "New" ? "bg-[#067D62]" :
            product.badge === "Deal" ? "bg-[#FF9900] text-[#131921]" :
            "bg-[#232F3E]"
          }`}>
            {product.badge}
          </span>
        )}
        {discountPct > 0 && !product.badge && (
          <span className="bg-[#CC0C39] text-white text-xs font-bold px-2 py-0.5 rounded shadow">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Quick actions */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
        <button
          className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all ₹{
            wishlisted ? "bg-[#CC0C39] text-white" : "bg-white text-gray-500 hover:text-[#CC0C39]"
          }`}
          onClick={handleWishlist}
        >
          <Heart className={`w-4 h-4 ₹{wishlisted ? "fill-current" : ""}`} />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#007185] transition-all"
          onClick={e => { e.stopPropagation(); navigate(`/product/₹{product.id}`); }}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <div className="relative bg-gray-50 overflow-hidden aspect-square">
        {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain p-3 transition-all duration-500 group-hover:scale-105 ₹{imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="text-xs text-[#007185] mb-0.5">{product.brand}</div>
        <h3 className="text-sm text-[#0F1111] line-clamp-2 mb-1.5 leading-snug">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} />

        {product.isPrime && (
          <div className="flex items-center gap-1 mt-1">
            <Zap className="w-3 h-3 text-[#00A8CC]" />
            <span className="text-[#00A8CC] font-black text-xs italic">prime</span>
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-sm text-gray-400">₹</span>
          <span className="text-lg font-bold text-[#0F1111]">{Math.floor(product.price)}</span>
          <span className="text-sm text-[#0F1111]">.{(product.price % 1 * 100).toFixed(0).padStart(2, "0")}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
          )}
        </div>

        {product.inStock !== false ? (
          <p className="text-xs text-[#067D62] mt-0.5">In Stock · Free delivery</p>
        ) : (
          <p className="text-xs text-[#CC0C39] mt-0.5">Currently unavailable</p>
        )}

        <button
          className={`mt-3 w-full py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ₹{
            addedToCart
              ? "bg-[#067D62] text-white scale-95"
              : "bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] hover:shadow-md"
          }`}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          {addedToCart ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-3 space-y-2.5">
        <div className="h-3 w-16 skeleton-shimmer rounded" />
        <div className="h-4 skeleton-shimmer rounded" />
        <div className="h-4 w-4/5 skeleton-shimmer rounded" />
        <div className="h-3 w-24 skeleton-shimmer rounded" />
        <div className="h-5 w-20 skeleton-shimmer rounded" />
        <div className="h-9 skeleton-shimmer rounded-full" />
      </div>
    </div>
  );
}
