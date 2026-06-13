import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  SlidersHorizontal, Grid3X3, List, ChevronDown, ChevronUp, ChevronLeft,
  X, Star, Check, ArrowUpDown, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard, SkeletonProductCard } from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import { api } from "../api/client";

const allProducts: Product[] = [
  { id: 1, name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", brand: "Apple", price: 1199.99, originalPrice: 1399.99, rating: 4.8, reviewCount: 12453, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=400&h=400&fit=crop&auto=format", badge: "Best Seller", isPrime: true, category: "Electronics" },
  { id: 2, name: "Samsung Galaxy S24 Ultra 512GB Titanium Black", brand: "Samsung", price: 1099.99, originalPrice: 1299.99, rating: 4.7, reviewCount: 8765, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Electronics" },
  { id: 3, name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", brand: "Sony", price: 279.99, originalPrice: 399.99, rating: 4.9, reviewCount: 34521, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format", badge: "Best Seller", isPrime: true, category: "Electronics" },
  { id: 4, name: "MacBook Air 15-inch M3 Chip 8GB RAM 256GB SSD", brand: "Apple", price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviewCount: 5432, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Computers" },
  { id: 5, name: "Nike Air Max 270 React Running Shoes - White/Black", brand: "Nike", price: 89.99, originalPrice: 129.99, rating: 4.6, reviewCount: 18765, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", badge: "New", isPrime: true, category: "Sports" },
  { id: 6, name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Qt", brand: "Instant Pot", price: 59.99, originalPrice: 99.99, rating: 4.7, reviewCount: 65432, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Home & Kitchen" },
  { id: 7, name: "Apple Watch Series 9 GPS 45mm Midnight Aluminum", brand: "Apple", price: 399.99, originalPrice: 499.99, rating: 4.8, reviewCount: 9876, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Electronics" },
  { id: 8, name: "Levi's 501 Original Fit Men's Jeans - Medium Wash", brand: "Levi's", price: 49.99, originalPrice: 69.99, rating: 4.5, reviewCount: 45678, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Clothing" },
  { id: 9, name: "Dyson V15 Detect Cordless Vacuum Cleaner", brand: "Dyson", price: 449.99, originalPrice: 749.99, rating: 4.8, reviewCount: 8765, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Home & Kitchen" },
  { id: 10, name: "Kindle Paperwhite 16GB Signature Edition", brand: "Amazon", price: 139.99, originalPrice: 189.99, rating: 4.7, reviewCount: 23456, image: "https://images.unsplash.com/photo-1512614094824-6a9baac8e4b0?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Electronics" },
  { id: 11, name: "Bose QuietComfort 45 Bluetooth Wireless Headphones", brand: "Bose", price: 199.99, originalPrice: 329.99, rating: 4.6, reviewCount: 15432, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", badge: "Deal", isPrime: true, category: "Electronics" },
  { id: 12, name: "Adidas Ultraboost 23 Running Shoes Men's", brand: "Adidas", price: 119.99, originalPrice: 189.99, rating: 4.7, reviewCount: 12765, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format", isPrime: true, category: "Sports" },
];

const filterGroups = [
  {
    label: "Customer Reviews",
    key: "rating",
    options: [
      { label: "4★ & above", value: "4", icon: true },
      { label: "3★ & above", value: "3", icon: true },
      { label: "2★ & above", value: "2", icon: true },
    ],
  },
  {
    label: "Price",
    key: "price",
    options: [
      { label: "Under ₹25", value: "0-25" },
      { label: "₹25 to ₹50", value: "25-50" },
      { label: "₹50 to ₹100", value: "50-100" },
      { label: "₹100 to ₹500", value: "100-500" },
      { label: "Over ₹500", value: "500-99999" },
    ],
  },
  {
    label: "Brand",
    key: "brand",
    options: [
      { label: "Apple", value: "Apple" },
      { label: "Samsung", value: "Samsung" },
      { label: "Sony", value: "Sony" },
      { label: "Nike", value: "Nike" },
      { label: "Adidas", value: "Adidas" },
      { label: "Bose", value: "Bose" },
      { label: "Dyson", value: "Dyson" },
    ],
  },
  {
    label: "Availability",
    key: "availability",
    options: [
      { label: "In Stock", value: "instock" },
      { label: "Prime Eligible", value: "prime" },
    ],
  },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Avg. Customer Review", value: "rating" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Best Sellers", value: "bestsellers" },
];

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || searchParams.get("q") || "All Products";
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openFilters, setOpenFilters] = useState<string[]>(["Customer Reviews", "Price", "Brand"]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [totalProducts, setTotalProducts] = useState(allProducts.length);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { page, page_size: 12, sort: sortBy };
    if (category !== "All Products") params.category = category;
    if (priceRange[0] > 0) params.min_price = priceRange[0];
    if (priceRange[1] < 2000) params.max_price = priceRange[1];
    if (filters.rating?.length) params.min_rating = Math.min(...filters.rating.map(Number));
    if (filters.brand?.length) params.brand = filters.brand[0];

    api.products.list(params)
      .then(res => {
        setProducts(res.products.map(p => ({
          id: p.id, name: p.name, brand: p.brand, price: p.price,
          originalPrice: p.original_price ?? p.price,
          rating: p.rating, reviewCount: p.review_count,
          image: p.image ?? "", badge: p.badge ?? undefined,
          isPrime: p.is_prime, category: p.category ?? undefined,
        })));
        setTotalProducts(res.total);
      })
      .catch(() => { setProducts(allProducts); setTotalProducts(allProducts.length); })
      .finally(() => setLoading(false));
  }, [category, page, sortBy, priceRange, filters]);

  const toggleFilter = (group: string, value: string) => {
    setFilters(prev => {
      const current = prev[group] || [];
      return {
        ...prev,
        [group]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
      };
    });
  };

  const toggleFilterGroup = (label: string) => {
    setOpenFilters(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const clearFilters = () => setFilters({});
  const activeFilterCount = Object.values(filters).flat().length;

  const FilterSidebar = () => (
    <aside className="w-full">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-[#0F1111]">Filters</h3>
          {activeFilterCount > 0 && (
            <button className="text-[#007185] text-xs hover:text-[#C7511F] flex items-center gap-1" onClick={clearFilters}>
              <X className="w-3.5 h-3.5" /> Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Price range */}
        <div className="p-4 border-b">
          <h4 className="font-semibold text-sm text-[#0F1111] mb-3">Price Range</h4>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="2000"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-[#FF9900]"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center"
                placeholder="Min"
              />
              <span className="text-gray-400 text-sm">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {filterGroups.map(group => (
          <div key={group.key} className="border-b last:border-0">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              onClick={() => toggleFilterGroup(group.label)}
            >
              <span className="font-semibold text-sm text-[#0F1111]">{group.label}</span>
              {openFilters.includes(group.label) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            <AnimatePresence>
              {openFilters.includes(group.label) && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {group.options.map(opt => {
                      const selected = (filters[group.key] || []).includes(opt.value);
                      return (
                        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                          <div
                            className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                              selected ? "bg-[#FF9900] border-[#FF9900]" : "border-gray-300 group-hover:border-[#FF9900]"
                            }`}
                            onClick={() => toggleFilter(group.key, opt.value)}
                          >
                            {selected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div
                            className="flex items-center gap-1.5 text-sm text-[#0F1111] cursor-pointer"
                            onClick={() => toggleFilter(group.key, opt.value)}
                          >
                            {opt.icon && (
                              <span className="flex">
                                {Array(parseInt(opt.value)).fill(0).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-[#FFA41C] text-[#FFA41C]" />
                                ))}
                              </span>
                            )}
                            {opt.label}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <button className="hover:text-[#007185] transition-colors" onClick={() => navigate("/")}>Home</button>
          <ChevronRight className="w-3 h-3" />
          <button className="hover:text-[#007185] transition-colors" onClick={() => navigate("/products")}>Products</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0F1111] font-medium">{category}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex gap-5">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-3 mb-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-[#0F1111] bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters {activeFilterCount > 0 && <span className="bg-[#FF9900] text-[#131921] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>}
                </button>
                <span className="text-sm text-gray-500">
                  {loading ? "..." : `${totalProducts} results`}
                  {category !== "All Products" && <span className="text-[#0F1111] font-medium"> for "{category}"</span>}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Active filter chips */}
                <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                  {Object.entries(filters).flatMap(([key, values]) =>
                    values.map(v => (
                      <span key={`${key}-${v}`} className="flex items-center gap-1 bg-[#FF9900]/10 text-[#131921] text-xs px-2.5 py-1 rounded-full border border-[#FF9900]/30">
                        {v} <button onClick={() => toggleFilter(key, v)}><X className="w-3 h-3" /></button>
                      </span>
                    ))
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors"
                    onClick={() => setSortOpen(!sortOpen)}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">{sortOptions.find(s => s.value === sortBy)?.label}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-100 z-30 overflow-hidden">
                      {sortOptions.map(opt => (
                        <button
                          key={opt.value}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === opt.value ? "text-[#FF9900] bg-[#FF9900]/5" : "text-[#0F1111]"}`}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        >
                          {opt.label}
                          {sortBy === opt.value && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className={`p-1.5 transition-colors ${view === "grid" ? "bg-[#FF9900] text-[#131921]" : "hover:bg-gray-100 text-gray-500"}`}
                    onClick={() => setView("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1.5 transition-colors ${view === "list" ? "bg-[#FF9900] text-[#131921]" : "hover:bg-gray-100 text-gray-500"}`}
                    onClick={() => setView("list")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile filter sidebar */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-4 overflow-hidden"
                >
                  <FilterSidebar />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products grid/list */}
            {loading ? (
              <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" : "space-y-3"}>
                {Array(8).fill(0).map((_, i) => <SkeletonProductCard key={i} />)}
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3" : "space-y-3"}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && (
              <div className="mt-8 flex items-center justify-center gap-1">
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1,2,3,4,5].map(p => (
                  <button
                    key={p}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === p ? "bg-[#FF9900] text-[#131921]" : "border border-gray-200 hover:bg-gray-50 text-[#0F1111]"
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-2 text-gray-400">...</span>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
                  onClick={() => setPage(42)}
                >
                  42
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

