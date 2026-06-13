import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, Flame, TrendingUp, Star, ArrowRight,
  Package, Shield, Truck, RotateCcw, Tag, Clock, Zap, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard, SkeletonProductCard } from "../components/ProductCard";
import type { Product } from "../components/ProductCard";

// Sample data
const heroSlides = [
  {
    id: 1,
    title: "Next-Gen Electronics",
    subtitle: "Up to 40% off on latest smartphones & laptops",
    cta: "Shop Electronics",
    gradient: "from-[#131921] via-[#1a2634] to-[#0d1b2a]",
    accent: "#FF9900",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=500&fit=crop&auto=format",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Fashion Forward",
    subtitle: "Discover the latest trends in clothing & accessories",
    cta: "Explore Fashion",
    gradient: "from-[#1a0a2e] via-[#16213e] to-[#0f3460]",
    accent: "#E94560",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop&auto=format",
    category: "Clothing",
  },
  {
    id: 3,
    title: "Home & Living",
    subtitle: "Transform your space with premium home essentials",
    cta: "Shop Home",
    gradient: "from-[#0a1628] via-[#132743] to-[#1b3a5c]",
    accent: "#00D2FF",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop&auto=format",
    category: "Home & Kitchen",
  },
  {
    id: 4,
    title: "Sports & Fitness",
    subtitle: "Gear up for your best performance yet",
    cta: "Shop Sports",
    gradient: "from-[#0d2318] via-[#1a3d2b] to-[#0f2d1e]",
    accent: "#00E676",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&auto=format",
    category: "Sports",
  },
];

const featuredCategories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop&auto=format", count: "50K+ products", color: "from-blue-900/80" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=200&fit=crop&auto=format", count: "120K+ products", color: "from-pink-900/80" },
  { name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&auto=format", count: "80K+ products", color: "from-amber-900/80" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop&auto=format", count: "30K+ products", color: "from-green-900/80" },
  { name: "Books", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&auto=format", count: "200K+ titles", color: "from-purple-900/80" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop&auto=format", count: "40K+ products", color: "from-rose-900/80" },
];

const sampleProducts: Product[] = [
  { id: 1, name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", brand: "Apple", price: 1199.99, originalPrice: 1399.99, rating: 4.8, reviewCount: 12453, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=400&h=400&fit=crop&auto=format", badge: "Best Seller", isPrime: true, category: "Electronics" },
  { id: 2, name: "Samsung Galaxy S24 Ultra 512GB Titanium Black", brand: "Samsung", price: 1099.99, originalPrice: 1299.99, rating: 4.7, reviewCount: 8765, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Electronics" },
  { id: 3, name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", brand: "Sony", price: 279.99, originalPrice: 399.99, rating: 4.9, reviewCount: 34521, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format", badge: "Best Seller", isPrime: true, category: "Electronics" },
  { id: 4, name: "MacBook Air 15-inch M3 Chip 8GB RAM 256GB SSD", brand: "Apple", price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviewCount: 5432, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Computers" },
  { id: 5, name: "Nike Air Max 270 React Running Shoes", brand: "Nike", price: 89.99, originalPrice: 129.99, rating: 4.6, reviewCount: 18765, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", badge: "New", isPrime: true, category: "Sports" },
  { id: 6, name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Quart", brand: "Instant Pot", price: 59.99, originalPrice: 99.99, rating: 4.7, reviewCount: 65432, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Home & Kitchen" },
  { id: 7, name: "Apple Watch Series 9 GPS 45mm Midnight Aluminum Case", brand: "Apple", price: 399.99, originalPrice: 499.99, rating: 4.8, reviewCount: 9876, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Electronics" },
  { id: 8, name: "Levi's 501 Original Fit Men's Jeans", brand: "Levi's", price: 49.99, originalPrice: 69.99, rating: 4.5, reviewCount: 45678, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Clothing" },
];

const deals = [
  { id: 10, name: "Kindle Paperwhite E-reader 16GB Signature Edition", brand: "Amazon", price: 139.99, originalPrice: 189.99, rating: 4.7, reviewCount: 23456, image: "https://images.unsplash.com/photo-1512614094824-6a9baac8e4b0?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, discount: 26, endsIn: "5:23:41" },
  { id: 11, name: "Dyson V15 Detect Cordless Vacuum Cleaner", brand: "Dyson", price: 449.99, originalPrice: 749.99, rating: 4.8, reviewCount: 8765, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, discount: 40, endsIn: "12:05:18" },
  { id: 12, name: "Bose QuietComfort 45 Bluetooth Wireless Headphones", brand: "Bose", price: 199.99, originalPrice: 329.99, rating: 4.6, reviewCount: 15432, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, discount: 39, endsIn: "8:45:22" },
];

const testimonials = [
  { name: "Sarah M.", location: "New York, NY", rating: 5, text: "ShopNest has completely transformed my online shopping experience. The product quality matches the descriptions perfectly, and delivery is always on time!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format" },
  { name: "James K.", location: "Los Angeles, CA", rating: 5, text: "Incredible selection and prices. The Prime delivery is a game-changer. I've saved hundreds of dollars compared to shopping elsewhere.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format" },
  { name: "Emily R.", location: "Chicago, IL", rating: 5, text: "The customer service is outstanding. Had a minor issue with a product and they resolved it within 24 hours. Highly recommend!", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format" },
  { name: "David L.", location: "Houston, TX", rating: 4, text: "Best prices online, period. The recommendation engine is surprisingly accurate too — always showing me exactly what I need.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format" },
];

function CountdownTimer({ time }: { time: string }) {
  const [t, setT] = useState(time);
  useEffect(() => {
    const timer = setInterval(() => {
      const [h, m, s] = t.split(":").map(Number);
      let totalSecs = h * 3600 + m * 60 + s - 1;
      if (totalSecs < 0) totalSecs = 86399;
      const nh = Math.floor(totalSecs / 3600);
      const nm = Math.floor((totalSecs % 3600) / 60);
      const ns = totalSecs % 60;
      setT(`${String(nh).padStart(2,"0")}:${String(nm).padStart(2,"0")}:${String(ns).padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [t]);
  const [h, m, s] = t.split(":");
  return (
    <div className="flex items-center gap-1">
      {[h, m, s].map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-[#131921] text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">{unit}</span>
          {i < 2 && <span className="text-[#131921] font-bold text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const slideTimer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    slideTimer.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer.current);
  }, []);

  const prevSlide = () => {
    clearInterval(slideTimer.current);
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };
  const nextSlide = () => {
    clearInterval(slideTimer.current);
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden h-[380px] md:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient} flex items-center`}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex items-center justify-between">
              <div className="text-white max-w-lg z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <Zap className="w-5 h-5" style={{ color: heroSlides[currentSlide].accent }} />
                  <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: heroSlides[currentSlide].accent }}>
                    Limited Time Offer
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-black mb-3 leading-tight"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 text-lg mb-6"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3"
                >
                  <button
                    className="px-8 py-3.5 rounded-full font-bold text-[#131921] text-sm hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                    style={{ backgroundColor: heroSlides[currentSlide].accent }}
                    onClick={() => navigate(`/products?category=${heroSlides[currentSlide].category}`)}
                  >
                    {heroSlides[currentSlide].cta}
                  </button>
                  <button
                    className="px-8 py-3.5 rounded-full font-bold text-white text-sm bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                    onClick={() => navigate("/products?filter=deals")}
                  >
                    View All Deals
                  </button>
                </motion.div>
              </div>
              <div className="hidden md:block w-80 h-72 relative">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover rounded-2xl opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#131921]/50 rounded-2xl" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-[#FF9900]" : "w-2 bg-white/50"}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* Quick feature badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: "Free Delivery", sub: "Orders over ₹25", color: "text-blue-600" },
            { icon: RotateCcw, label: "30-Day Returns", sub: "Easy & free", color: "text-green-600" },
            { icon: Shield, label: "Secure Payment", sub: "100% protected", color: "text-purple-600" },
            { icon: Package, label: "Quality Guaranteed", sub: "Authentic products", color: "text-[#FF9900]" },
          ].map(feature => (
            <div key={feature.label} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${feature.color} bg-gray-50 rounded-lg p-2.5`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#0F1111]">{feature.label}</div>
                <div className="text-xs text-gray-500">{feature.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0F1111] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#FF9900]" /> Shop by Category
            </h2>
            <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium flex items-center gap-1 transition-colors" onClick={() => navigate("/products")}>
              See all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredCategories.map(cat => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-xl overflow-hidden cursor-pointer group h-32 bg-gray-200 shadow-sm"
                onClick={() => navigate(`/products?category=${cat.name}`)}
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent flex flex-col justify-end p-3`}>
                  <div className="text-white font-bold text-sm">{cat.name}</div>
                  <div className="text-white/80 text-xs">{cat.count}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Today's Deals */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#CC0C39]" />
                <h2 className="text-xl font-bold text-[#0F1111]">Today's Deals</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" /> Ends in:
                <CountdownTimer time="08:45:22" />
              </div>
            </div>
            <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium flex items-center gap-1 transition-colors" onClick={() => navigate("/products?filter=deals")}>
              See all deals <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deals.map(deal => (
              <motion.div
                key={deal.id}
                whileHover={{ y: -3 }}
                className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-[#FF9900]/40 hover:shadow-md transition-all"
                onClick={() => navigate(`/product/${deal.id}`)}
              >
                <div className="relative">
                  <img src={deal.image} alt={deal.name} className="w-full h-44 object-cover" />
                  <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{deal.discount}% OFF
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <CountdownTimer time={deal.endsIn!} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#007185]">{deal.brand}</p>
                  <p className="text-sm font-medium line-clamp-2 text-[#0F1111] my-1">{deal.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#CC0C39]">₹{deal.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{deal.originalPrice}</span>
                  </div>
                  {/* Progress bar for deal popularity */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>🔥 {Math.floor(Math.random() * 40 + 60)}% claimed</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#CC0C39] h-1.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 40 + 50)}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0F1111] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF9900]" /> Trending Now
            </h2>
            <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium flex items-center gap-1 transition-colors" onClick={() => navigate("/products")}>
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {loading
              ? Array(8).fill(0).map((_, i) => <SkeletonProductCard key={i} />)
              : sampleProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </section>

        {/* Banner promo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "New Arrivals",
              sub: "Fresh drops every week",
              cta: "Shop Now",
              bg: "from-[#131921] to-[#232F3E]",
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop&auto=format",
              path: "/products?filter=new"
            },
            {
              title: "Prime Members Save More",
              sub: "Exclusive deals for Prime",
              cta: "Try Prime Free",
              bg: "from-[#1a0050] to-[#00A8CC]",
              image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&auto=format",
              path: "/products"
            }
          ].map(banner => (
            <motion.div
              key={banner.title}
              whileHover={{ scale: 1.01 }}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${banner.bg} p-6 flex items-center justify-between cursor-pointer shadow-md h-40`}
              onClick={() => navigate(banner.path)}
            >
              <div className="text-white z-10">
                <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                <p className="text-white/70 text-sm mb-3">{banner.sub}</p>
                <button className="bg-[#FF9900] text-[#131921] text-sm font-bold px-4 py-2 rounded-full hover:bg-[#E88B00] transition-colors">
                  {banner.cta}
                </button>
              </div>
              <img src={banner.image} alt={banner.title} className="absolute right-0 top-0 h-full w-48 object-cover opacity-30" />
            </motion.div>
          ))}
        </div>

        {/* Best Sellers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0F1111] flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFA41C] fill-current" /> Best Sellers
            </h2>
            <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium flex items-center gap-1 transition-colors" onClick={() => navigate("/products?filter=bestseller")}>
              See all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sampleProducts.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={{ ...product, badge: i === 0 ? "Best Seller" : undefined }} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F1111] mb-6 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FFA41C] text-[#FFA41C]" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-[#0F1111]">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-[#131921] to-[#232F3E] rounded-2xl p-8 text-white shadow-lg">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
            <p className="text-gray-300 text-sm mb-6">Subscribe to get exclusive deals, new arrivals, and early access to sales.</p>
            <form className="flex gap-2" onSubmit={e => { e.preventDefault(); setEmail(""); }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-[#FF9900] transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">No spam, ever. Unsubscribe at any time.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
