import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search, TrendingUp, Clock, X, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ProductCard, SkeletonProductCard } from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import { api } from "../api/client";

const allProducts: Product[] = [
  { id: 1, name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", brand: "Apple", price: 1199.99, originalPrice: 1399.99, rating: 4.8, reviewCount: 12453, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=400&h=400&fit=crop&auto=format", badge: "Best Seller", isPrime: true },
  { id: 2, name: "Samsung Galaxy S24 Ultra 512GB", brand: "Samsung", price: 1099.99, originalPrice: 1299.99, rating: 4.7, reviewCount: 8765, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 3, name: "Sony WH-1000XM5 Wireless Headphones", brand: "Sony", price: 279.99, originalPrice: 399.99, rating: 4.9, reviewCount: 34521, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format", badge: "Best Seller", isPrime: true },
  { id: 4, name: "MacBook Air 15-inch M3 Chip", brand: "Apple", price: 1299.99, originalPrice: 1499.99, rating: 4.8, reviewCount: 5432, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format", isPrime: true },
  { id: 5, name: "Nike Air Max 270 React Running Shoes", brand: "Nike", price: 89.99, originalPrice: 129.99, rating: 4.6, reviewCount: 18765, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", isPrime: true },
];

const trendingSearches = [
  "iPhone 15 Pro", "MacBook Air M3", "Sony headphones", "Samsung Galaxy",
  "Nike shoes", "AirPods Pro", "iPad Pro", "PS5 controller"
];

const recentSearches = [
  "Sony WH-1000XM5", "Apple iPhone 15", "Nike Air Max"
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>(allProducts);

  useEffect(() => {
    setInputValue(query);
    if (!query) { setSearchResults([]); return; }
    setLoading(true);
    api.products.list({ search: query, page_size: 20 })
      .then(res => setSearchResults(res.products.map(p => ({
        id: p.id, name: p.name, brand: p.brand, price: p.price,
        originalPrice: p.original_price ?? p.price,
        rating: p.rating, reviewCount: p.review_count,
        image: p.image ?? "", badge: p.badge ?? undefined,
        isPrime: p.is_prime,
      }))))
      .catch(() => setSearchResults(allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )))
      .finally(() => setLoading(false));
  }, [query]);

  const filteredProducts = searchResults;

  useEffect(() => {
    if (inputValue.trim()) {
      setSuggestions(
        trendingSearches.filter(s => s.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 6)
      );
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleSearch = (q: string) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <form onSubmit={e => { e.preventDefault(); handleSearch(inputValue); }}>
            <div className="flex bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 focus-within:border-[#FF9900] transition-colors">
              <div className="px-4 flex items-center text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search products, brands, categories..."
                className="flex-1 py-4 pr-4 outline-none text-[#0F1111] text-base"
              />
              {inputValue && (
                <button type="button" className="px-3 text-gray-400 hover:text-gray-600" onClick={() => setInputValue("")}>
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] px-6 font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && (inputValue ? suggestions.length > 0 : true) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 mt-1 overflow-hidden"
            >
              {!inputValue && (
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    <Clock className="w-3.5 h-3.5" /> Recent Searches
                  </div>
                  {recentSearches.map(s => (
                    <div
                      key={s}
                      className="flex items-center gap-3 py-2.5 px-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                      onClick={() => handleSearch(s)}
                    >
                      <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <span className="text-sm text-[#0F1111]">{s}</span>
                      <X className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                    </div>
                  ))}

                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-4">
                    <TrendingUp className="w-3.5 h-3.5" /> Trending
                  </div>
                  {trendingSearches.slice(0, 5).map(s => (
                    <div
                      key={s}
                      className="flex items-center gap-3 py-2.5 px-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                      onClick={() => handleSearch(s)}
                    >
                      <TrendingUp className="w-4 h-4 text-[#FF9900] flex-shrink-0" />
                      <span className="text-sm text-[#0F1111]">{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {inputValue && suggestions.map(s => (
                <div
                  key={s}
                  className="flex items-center gap-3 py-3 px-5 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSearch(s)}
                >
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-[#0F1111]">{s}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {query ? (
          <>
            {/* Results header */}
            <div className="mb-4">
              <h1 className="text-lg text-[#0F1111]">
                {loading ? "Searching..." : `${filteredProducts.length} results for`}{" "}
                <span className="font-bold">"{query}"</span>
              </h1>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array(8).fill(0).map((_, i) => <SkeletonProductCard key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              // No results
              <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#0F1111] mb-2">No results for "{query}"</h2>
                <p className="text-gray-500 mb-6">Try checking your spelling or use more general terms</p>
                <div className="space-y-2 text-left max-w-sm mx-auto mb-6">
                  {["Check the spelling of your search term", "Use fewer or different keywords", "Try searching a broader category"].map(tip => (
                    <div key={tip} className="flex items-start gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-[#FF9900] mt-0.5 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F1111] mb-3">Try these trending searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {trendingSearches.slice(0, 6).map(s => (
                      <button
                        key={s}
                        className="bg-gray-100 hover:bg-[#FF9900]/10 hover:text-[#C7511F] text-gray-600 text-sm px-3 py-1.5 rounded-full transition-colors"
                        onClick={() => handleSearch(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty search state */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#FF9900]" />
                <h2 className="font-bold text-[#0F1111]">Trending Searches</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gray-100 hover:bg-[#FF9900]/10 hover:text-[#C7511F] hover:border-[#FF9900]/30 border border-transparent text-gray-700 text-sm px-4 py-2 rounded-full transition-all"
                    onClick={() => handleSearch(s)}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0F1111] mb-4">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=120&fit=crop&auto=format" },
                  { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=120&fit=crop&auto=format" },
                  { name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=120&fit=crop&auto=format" },
                  { name: "Sports", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop&auto=format" },
                ].map(cat => (
                  <motion.button
                    key={cat.name}
                    whileHover={{ scale: 1.03 }}
                    className="relative h-24 rounded-xl overflow-hidden cursor-pointer text-left"
                    onClick={() => navigate(`/products?category=${cat.name}`)}
                  >
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white font-bold text-sm">{cat.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
