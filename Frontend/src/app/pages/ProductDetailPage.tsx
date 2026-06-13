import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Star, Heart, ShoppingCart, Zap, Shield, Truck, RotateCcw,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Share2,
  ThumbsUp, ThumbsDown, Check, Package, MapPin, Plus, Minus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../components/ProductCard";

const productImages = [
  "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop&auto=format",
];

const relatedProducts: Product[] = [
  { id: 2, name: "Samsung Galaxy S24 Ultra 512GB", brand: "Samsung", price: 1099.99, originalPrice: 1299.99, rating: 4.7, reviewCount: 8765, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 3, name: "Sony WH-1000XM5 Headphones", brand: "Sony", price: 279.99, originalPrice: 399.99, rating: 4.9, reviewCount: 34521, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 7, name: "Apple Watch Series 9 GPS 45mm", brand: "Apple", price: 399.99, originalPrice: 499.99, rating: 4.8, reviewCount: 9876, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 4, name: "MacBook Air 15-inch M3", brand: "Apple", price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviewCount: 5432, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format", isPrime: true },
];

const reviews = [
  { id: 1, author: "TechEnthusiast2024", rating: 5, title: "Best iPhone Yet — Absolutely Worth the Upgrade", date: "December 15, 2024", verified: true, helpful: 234, text: "I've been using the iPhone 15 Pro Max for two weeks now and I am absolutely blown away. The titanium build quality is exceptional — it feels premium without being heavy. The A17 Pro chip handles everything I throw at it without breaking a sweat.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" },
  { id: 2, author: "PhotoProfessional", rating: 5, title: "Camera System is Unbelievably Good", date: "December 10, 2024", verified: true, helpful: 189, text: "As a professional photographer who's always had a DSLR glued to my hand, I never thought a phone could match my camera quality. The 5x optical zoom is game-changing. Night photography has improved dramatically over previous models.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" },
  { id: 3, author: "GadgetReviewer", rating: 4, title: "Great Phone, Minor Nitpicks", date: "December 5, 2024", verified: true, helpful: 145, text: "The iPhone 15 Pro Max is undoubtedly one of the best phones on the market. Battery life is excellent — I consistently get through a full day with 20-30% remaining. The only reason I'm giving 4 stars is the price.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop" },
];

const specs = [
  { label: "Brand", value: "Apple" },
  { label: "Model", value: "iPhone 15 Pro Max" },
  { label: "Storage", value: "256GB" },
  { label: "Color", value: "Natural Titanium" },
  { label: "Display", value: "6.7-inch Super Retina XDR OLED" },
  { label: "Processor", value: "A17 Pro chip" },
  { label: "RAM", value: "8GB" },
  { label: "Camera", value: "48MP Main + 12MP Ultra-wide + 12MP Telephoto" },
  { label: "Battery", value: "4422 mAh" },
  { label: "OS", value: "iOS 17" },
  { label: "Connectivity", value: "5G, Wi-Fi 6E, Bluetooth 5.3, USB-C" },
  { label: "Weight", value: "221g" },
];

const faqs = [
  { q: "Does this come with a charger?", a: "No, Apple no longer includes a charger in the box. The iPhone 15 Pro Max comes with a USB-C to USB-C cable. A USB-C power adapter is sold separately." },
  { q: "Is this model carrier unlocked?", a: "Yes, this listing is for the fully unlocked version compatible with all major carriers including AT&T, Verizon, T-Mobile, and international carriers." },
  { q: "What's the warranty?", a: "This product comes with a 1-year limited warranty from Apple. You can optionally purchase AppleCare+ for extended coverage up to 2 years." },
  { q: "Does it support 5G?", a: "Yes, the iPhone 15 Pro Max supports both Sub-6GHz and mmWave 5G networks for ultra-fast connectivity." },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Natural Titanium");
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewFilter, setReviewFilter] = useState(0);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const ratingBreakdown = [
    { stars: 5, percent: 72 },
    { stars: 4, percent: 18 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
          {["Home", "Electronics", "Smartphones", "Apple"].map((crumb, i, arr) => (
            <span key={crumb} className="flex items-center gap-1.5">
              <button className="hover:text-[#007185] transition-colors" onClick={() => i === 0 ? navigate("/") : navigate(`/products?category=${crumb}`)}>
                {crumb}
              </button>
              {i < arr.length - 1 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
            </span>
          ))}
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0F1111] font-medium truncate max-w-xs">iPhone 15 Pro Max</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                {/* Main image */}
                <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-3 aspect-square group">
                  <motion.img
                    key={currentImage}
                    src={productImages[currentImage]}
                    alt="iPhone 15 Pro Max"
                    className="w-full h-full object-contain p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => setCurrentImage(prev => (prev - 1 + productImages.length) % productImages.length)}
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => setCurrentImage(prev => (prev + 1) % productImages.length)}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2">
                  {productImages.map((img, i) => (
                    <button
                      key={i}
                      className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? "border-[#FF9900]" : "border-transparent hover:border-gray-300"}`}
                      onClick={() => setCurrentImage(i)}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              {/* Share */}
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#007185] text-sm font-medium py-2.5 rounded-xl shadow-sm border border-gray-100 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-xs text-[#007185] mb-1">Visit the Apple Store</div>
              <h1 className="text-xl font-bold text-[#0F1111] mb-2 leading-snug">
                Apple iPhone 15 Pro Max, 256GB, Natural Titanium — Unlocked (Renewed Premium)
              </h1>

              {/* Rating summary */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= 4 ? "fill-[#FFA41C] text-[#FFA41C]" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-[#007185] text-sm hover:text-[#C7511F] cursor-pointer">4.8</span>
                <span className="text-gray-300 text-sm">|</span>
                <span className="text-[#007185] text-sm hover:text-[#C7511F] cursor-pointer">12,453 ratings</span>
                <span className="text-gray-300 text-sm">|</span>
                <span className="text-[#007185] text-sm hover:text-[#C7511F] cursor-pointer">#1 Best Seller</span>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-3">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-gray-500">₹</span>
                  <span className="text-3xl font-bold text-[#0F1111]">1,199</span>
                  <span className="text-xl text-[#0F1111]">.99</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  List Price: <span className="line-through">₹1,399.99</span>
                  <span className="text-[#CC0C39] font-semibold ml-2">Save ₹200 (14%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#00A8CC]" />
                  <span className="text-[#00A8CC] font-black italic text-sm">prime</span>
                  <span className="text-gray-500 text-xs">FREE delivery Tomorrow</span>
                </div>
              </div>

              {/* Color selection */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-[#0F1111] mb-2">
                  Color: <span className="font-normal">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Natural Titanium", "Black Titanium", "White Titanium", "Blue Titanium"].map(color => (
                    <button
                      key={color}
                      className={`px-3 py-1.5 rounded-md text-xs border transition-all ${
                        selectedColor === color
                          ? "border-[#FF9900] bg-[#FF9900]/5 text-[#131921] font-medium ring-1 ring-[#FF9900]"
                          : "border-gray-200 hover:border-gray-400 text-gray-600"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage selection */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-[#0F1111] mb-2">
                  Storage: <span className="font-normal">{selectedStorage}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { size: "256GB", price: "₹1,199.99" },
                    { size: "512GB", price: "₹1,399.99" },
                    { size: "1TB", price: "₹1,599.99" },
                  ].map(({ size, price }) => (
                    <button
                      key={size}
                      className={`px-4 py-2 rounded-md text-xs border transition-all ${
                        selectedStorage === size
                          ? "border-[#FF9900] bg-[#FF9900]/5 text-[#131921] font-medium ring-1 ring-[#FF9900]"
                          : "border-gray-200 hover:border-gray-400 text-gray-600"
                      }`}
                      onClick={() => setSelectedStorage(size)}
                    >
                      <div className="font-semibold">{size}</div>
                      <div className="text-gray-500">{price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key features */}
              <div className="mb-4">
                <ul className="space-y-1.5">
                  {[
                    "Titanium design with textured matte glass back",
                    "6.7-inch Super Retina XDR display with ProMotion",
                    "A17 Pro chip — fastest chip in a smartphone",
                    "Pro camera system: 48MP Main, 12MP Ultra Wide, 12MP 5x Telephoto",
                    "All-day battery life and up to 25h video playback",
                    "USB 3 speeds with USB-C connector"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#067D62] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Buy box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
              <div className="text-2xl font-bold text-[#0F1111] mb-1">₹1,199.99</div>

              {/* Delivery info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <Truck className="w-4 h-4 text-[#067D62] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#067D62] font-semibold">FREE delivery</span>{" "}
                    <span className="text-[#0F1111] font-medium">Tomorrow, Dec 20</span>
                    <div className="text-xs text-gray-500">Order within <span className="text-[#CC0C39] font-semibold">5 hrs 23 mins</span></div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    Deliver to <span className="text-[#007185] cursor-pointer hover:text-[#C7511F]">New York 10001</span>
                  </div>
                </div>
              </div>

              <div className="text-lg font-semibold text-[#067D62] mb-4">In Stock</div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-[#0F1111]">Qty:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold border-x border-gray-200 h-9 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5 mb-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
                    addedToCart
                      ? "bg-[#067D62] text-white"
                      : "bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] hover:shadow-md"
                  }`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#131921] font-bold text-sm rounded-full transition-all hover:shadow-md"
                  onClick={() => navigate("/checkout")}
                >
                  Buy Now
                </motion.button>
                <button
                  className={`w-full py-2.5 border rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    wishlisted
                      ? "border-[#CC0C39] text-[#CC0C39] bg-red-50"
                      : "border-gray-300 text-gray-600 hover:border-[#CC0C39] hover:text-[#CC0C39]"
                  }`}
                  onClick={() => setWishlisted(!wishlisted)}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                  {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {/* Trust badges */}
              <div className="border-t pt-4 space-y-2">
                {[
                  { icon: Shield, text: "Secure transaction" },
                  { icon: Package, text: "Ships from ShopNest" },
                  { icon: RotateCcw, text: "30-day return eligible" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-gray-600">
                    <item.icon className="w-4 h-4 text-[#067D62] flex-shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b flex overflow-x-auto">
            {["overview", "specifications", "reviews", "faqs"].map(tab => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-[#FF9900] text-[#FF9900]"
                    : "border-transparent text-gray-500 hover:text-[#0F1111]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "faqs" ? "FAQs" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Specifications */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="font-bold text-[#0F1111] mb-4">Technical Specifications</h3>
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  {(showAllSpecs ? specs : specs.slice(0, 6)).map((spec, i) => (
                    <div key={spec.label} className={`flex ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <div className="w-40 px-4 py-3 text-sm font-semibold text-[#0F1111] flex-shrink-0">{spec.label}</div>
                      <div className="px-4 py-3 text-sm text-gray-600 border-l border-gray-100">{spec.value}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-3 text-[#007185] hover:text-[#C7511F] text-sm font-medium flex items-center gap-1 transition-colors"
                  onClick={() => setShowAllSpecs(!showAllSpecs)}
                >
                  {showAllSpecs ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> See all {specs.length} specs</>}
                </button>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex gap-8 mb-6 flex-wrap">
                  {/* Rating summary */}
                  <div className="text-center">
                    <div className="text-5xl font-black text-[#0F1111] mb-1">4.8</div>
                    <div className="flex justify-center mb-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= 4 ? "fill-[#FFA41C] text-[#FFA41C]" : s <= 4.8 ? "fill-[#FFA41C]/60 text-[#FFA41C]" : "text-gray-300"}`} />)}
                    </div>
                    <div className="text-xs text-gray-500">12,453 ratings</div>
                  </div>
                  {/* Breakdown bars */}
                  <div className="flex-1 min-w-48 space-y-1.5">
                    {ratingBreakdown.map(({ stars, percent }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <button className="text-[#007185] text-xs hover:text-[#C7511F] w-12 text-right flex-shrink-0">{stars} star</button>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#FFA41C] h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8 flex-shrink-0">{percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review filter */}
                <div className="flex gap-2 mb-5 flex-wrap">
                  {["All Reviews", "5 Star", "4 Star", "3 Star", "Critical"].map((f, i) => (
                    <button
                      key={f}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        reviewFilter === i
                          ? "bg-[#FF9900] border-[#FF9900] text-[#131921]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                      onClick={() => setReviewFilter(i)}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Reviews list */}
                <div className="space-y-5">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-2">
                        <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-sm text-[#0F1111]">{review.author}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex">
                              {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-[#FFA41C] text-[#FFA41C]" : "text-gray-300"}`} />)}
                            </div>
                            <span className="font-semibold text-sm text-[#0F1111]">{review.title}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Reviewed on {review.date}
                        {review.verified && <span className="text-[#CC7722] ml-2">✓ Verified Purchase</span>}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.text}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Helpful?</span>
                        <button className="flex items-center gap-1 hover:text-[#0F1111] transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> Yes ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1 hover:text-[#0F1111] transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" /> No
                        </button>
                        <button className="hover:text-[#CC0C39] transition-colors">Report</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeTab === "faqs" && (
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-sm text-[#0F1111] pr-4">{faq.q}</span>
                      {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {expandedFaq === i && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="prose prose-sm max-w-none">
                <h3 className="font-bold text-[#0F1111] mb-3">About this item</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The iPhone 15 Pro Max represents Apple's most advanced smartphone to date, featuring a stunning titanium design that's both lightweight and incredibly durable. The aerospace-grade titanium frame provides premium protection while the textured matte glass back ensures a comfortable grip.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Performance", desc: "Powered by the A17 Pro chip built on a 3nm process, delivering unprecedented CPU and GPU performance" },
                    { title: "Camera", desc: "Triple-camera system with a 48MP main camera, 12MP ultrawide, and 12MP 5x telephoto lens" },
                    { title: "Display", desc: "6.7-inch Super Retina XDR OLED with ProMotion adaptive refresh rate up to 120Hz" },
                    { title: "Battery", desc: "All-day battery life with up to 25 hours of video playback and 15W MagSafe wireless charging" },
                  ].map(feature => (
                    <div key={feature.title} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-bold text-sm text-[#0F1111] mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#0F1111] mb-4">Customers Also Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
