import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown, MapPin,
  Heart, Bell, Package, LogOut, Settings, HelpCircle, Sun, Moon,
  Truck, Shield, RotateCcw, Headphones, Smartphone, Laptop, Shirt,
  Home, Dumbbell, Book, Camera, Car, Gamepad2, Baby
} from "lucide-react";
import { api } from "../api/client";

const categories = [
  { icon: Smartphone, label: "Electronics" },
  { icon: Shirt, label: "Clothing" },
  { icon: Home, label: "Home & Kitchen" },
  { icon: Dumbbell, label: "Sports" },
  { icon: Book, label: "Books" },
  { icon: Camera, label: "Photography" },
  { icon: Car, label: "Automotive" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Baby, label: "Baby" },
  { icon: Laptop, label: "Computers" },
];

const megaMenuData = {
  Electronics: [
    { title: "Mobile Phones", items: ["Smartphones", "Feature Phones", "Refurbished Phones"] },
    { title: "Computers", items: ["Laptops", "Desktops", "Tablets", "Monitors"] },
    { title: "Audio", items: ["Headphones", "Speakers", "Earbuds", "Sound Systems"] },
    { title: "TV & Home", items: ["Smart TVs", "Streaming Devices", "Projectors"] },
  ],
  Clothing: [
    { title: "Men", items: ["T-Shirts", "Shirts", "Jeans", "Formal Wear", "Activewear"] },
    { title: "Women", items: ["Dresses", "Tops", "Jeans", "Ethnic Wear", "Accessories"] },
    { title: "Kids", items: ["Boys", "Girls", "Infants", "School Uniforms"] },
  ],
};

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  darkMode?: boolean;
  onToggleDark?: () => void;
}

export function Header({ cartCount: cartCountProp = 0, wishlistCount: wishlistCountProp = 0, darkMode = false, onToggleDark }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartCount, setCartCount] = useState(cartCountProp);
  const [wishlistCount, setWishlistCount] = useState(wishlistCountProp);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchSuggestions] = useState([
    "iPhone 15 Pro Max", "Samsung Galaxy S24", "MacBook Air M3",
    "Sony WH-1000XM5", "Nike Air Max", "Apple Watch Series 9"
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      api.cart.get().then(items => setCartCount(items.reduce((s, i) => s + i.quantity, 0))).catch(() => {});
      api.wishlist.get().then(items => setWishlistCount(items.length)).catch(() => {});
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
    }
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-[#131921] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#FF9900] transition-colors">
            <Truck className="w-3.5 h-3.5" />
            <span>Free shipping on orders over $25</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>Buyer Protection Guaranteed</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-[#FF9900] transition-colors">
            <RotateCcw className="w-3 h-3" /> Easy Returns
          </span>
          <span className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-[#FF9900] transition-colors">
            <Headphones className="w-3 h-3" /> 24/7 Support
          </span>
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1 hover:text-[#FF9900] transition-colors"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[#131921] text-white sticky top-0 z-50 shadow-2xl">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="flex flex-col leading-none">
              <span className="text-white text-2xl font-black tracking-tight">ShopNest</span>
              <span className="text-[#FF9900] text-xs font-semibold tracking-widest ml-0.5">.com</span>
            </div>
          </div>

          {/* Deliver to */}
          <div
            className="hidden lg:flex items-center gap-1.5 cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 transition-all group ml-1"
            onClick={() => navigate("/account")}
          >
            <MapPin className="w-4 h-4 text-[#FF9900] flex-shrink-0 mt-0.5" />
            <div className="leading-tight">
              <div className="text-gray-400 text-xs">Deliver to</div>
              <div className="text-white text-sm font-semibold">New York 10001</div>
            </div>
          </div>

          {/* Search bar */}
          <div ref={searchRef} className="flex-1 relative max-w-3xl mx-2">
            <form onSubmit={handleSearch} className="flex">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="hidden md:block bg-[#F3F3F3] text-[#131921] text-xs px-2 py-0 rounded-l-md border-0 outline-none cursor-pointer h-10 pr-6 border-r border-gray-300"
              >
                <option>All</option>
                {categories.map(c => <option key={c.label}>{c.label}</option>)}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search products, brands and categories..."
                className="flex-1 h-10 px-4 text-[#131921] outline-none bg-white text-sm md:rounded-none rounded-l-md"
              />
              <button
                type="submit"
                className="bg-[#FF9900] hover:bg-[#E88B00] h-10 w-12 flex items-center justify-center rounded-r-md transition-colors flex-shrink-0"
              >
                <Search className="w-5 h-5 text-[#131921]" />
              </button>
            </form>

            {/* Search suggestions dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 bg-white text-[#131921] shadow-2xl rounded-b-lg z-50 border-t-0 overflow-hidden">
                {searchQuery === "" ? (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Trending Searches</p>
                    {searchSuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 cursor-pointer rounded transition-colors"
                        onClick={() => { setSearchQuery(s); setSearchFocused(false); navigate(`/search?q=${encodeURIComponent(s)}`); }}
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2">
                    {searchSuggestions
                      .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => { setSearchQuery(s); setSearchFocused(false); navigate(`/search?q=${encodeURIComponent(s)}`); }}
                        >
                          <Search className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{s}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Account */}
            <div ref={userMenuRef} className="relative hidden md:block">
              <button
                className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1.5 transition-all text-left"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="w-5 h-5" />
                <div className="leading-tight hidden lg:block">
                  <div className="text-xs text-gray-300">{isLoggedIn ? "Hello!" : "Hello, Sign in"}</div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    Account <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white text-[#131921] shadow-2xl rounded-lg z-50 overflow-hidden animate-fade-in">
                  {isLoggedIn ? (
                    <div className="p-3 border-b">
                      <button
                        className="w-full bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-semibold py-2 rounded-md transition-colors text-sm"
                        onClick={() => { navigate("/account"); setUserMenuOpen(false); }}
                      >
                        My Account
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 border-b">
                      <button
                        className="w-full bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-semibold py-2 rounded-md transition-colors text-sm"
                        onClick={() => { navigate("/auth"); setUserMenuOpen(false); }}
                      >
                        Sign In
                      </button>
                      <p className="text-xs text-center mt-2 text-gray-600">
                        New customer? <span className="text-[#007185] cursor-pointer hover:text-[#C7511F]" onClick={() => { navigate("/auth?mode=signup"); setUserMenuOpen(false); }}>Start here</span>
                      </p>
                    </div>
                  )}
                  <div className="p-2">
                    {[
                      { icon: Package, label: "Your Orders", path: "/account?tab=orders" },
                      { icon: Heart, label: "Your Wishlist", path: "/wishlist" },
                      { icon: Settings, label: "Account Settings", path: "/account" },
                      { icon: HelpCircle, label: "Customer Service", path: "/support" },
                      { icon: LogOut, label: isLoggedIn ? "Sign Out" : "Sign In", path: "/auth" },
                    ].map(item => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors text-sm text-left"
                        onClick={() => {
                          if (item.label === "Sign Out") localStorage.removeItem("token");
                          navigate(item.path); setUserMenuOpen(false);
                        }}
                      >
                        <item.icon className="w-4 h-4 text-gray-500" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              className="hidden sm:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1.5 transition-all relative"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="w-5 h-5" />
              <div className="hidden lg:block leading-tight text-left">
                <div className="text-xs text-gray-300">Saved</div>
                <div className="text-sm font-semibold">Wishlist</div>
              </div>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 left-4 bg-[#FF9900] text-[#131921] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              className="hidden sm:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1.5 transition-all relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 left-4 bg-[#CC0C39] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>

            {/* Cart */}
            <button
              className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1.5 transition-all relative"
              onClick={() => navigate("/cart")}
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-[#FF9900] text-[#131921] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-semibold">Cart</span>
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden flex items-center hover:outline hover:outline-1 hover:outline-white rounded p-1.5 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary navigation */}
        <nav className="bg-[#232F3E] px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            <button
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-white/10 whitespace-nowrap transition-colors rounded-sm font-medium"
              onClick={() => setMegaMenuOpen(megaMenuOpen ? null : "all")}
            >
              <Menu className="w-4 h-4" /> All
            </button>
            {["Today's Deals", "Buy Again", "Customer Service", "Registry", "Gift Cards"].map(item => (
              <button
                key={item}
                className="px-3 py-2.5 text-sm text-white hover:bg-white/10 whitespace-nowrap transition-colors rounded-sm"
                onClick={() => navigate(item === "Today's Deals" ? "/products?filter=deals" : item === "Customer Service" ? "/support" : "/")}
              >
                {item}
              </button>
            ))}
            <div className="flex-1" />
            {categories.map(cat => (
              <button
                key={cat.label}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-2.5 text-sm text-white hover:bg-white/10 whitespace-nowrap transition-colors rounded-sm"
                onMouseEnter={() => setMegaMenuOpen(cat.label)}
                onMouseLeave={() => setMegaMenuOpen(null)}
                onClick={() => navigate(`/products?category=${cat.label}`)}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mega menu */}
        {megaMenuOpen && megaMenuData[megaMenuOpen as keyof typeof megaMenuData] && (
          <div
            className="absolute top-full left-0 right-0 bg-white text-[#131921] shadow-2xl z-40 animate-fade-in"
            onMouseEnter={() => setMegaMenuOpen(megaMenuOpen)}
            onMouseLeave={() => setMegaMenuOpen(null)}
          >
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {megaMenuData[megaMenuOpen as keyof typeof megaMenuData]?.map(section => (
                <div key={section.title}>
                  <h4 className="font-bold text-[#131921] mb-3 text-sm border-b pb-2">{section.title}</h4>
                  <ul className="space-y-1.5">
                    {section.items.map(item => (
                      <li key={item}>
                        <button
                          className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline transition-colors"
                          onClick={() => { navigate(`/products?q=${item}`); setMegaMenuOpen(null); }}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#232F3E] border-t border-white/10 animate-slide-up">
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-md text-sm" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>
                <User className="w-4 h-4" /> Sign In / Sign Up
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-md text-sm" onClick={() => { navigate("/wishlist"); setMobileMenuOpen(false); }}>
                <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-md text-sm" onClick={() => { navigate("/notifications"); setMobileMenuOpen(false); }}>
                <Bell className="w-4 h-4" /> Notifications
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-md text-sm" onClick={() => { navigate("/account"); setMobileMenuOpen(false); }}>
                <Settings className="w-4 h-4" /> Account
              </button>
              <div className="border-t border-white/10 pt-2 grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.label}
                    className="flex items-center gap-2 p-2.5 hover:bg-white/10 rounded-md text-sm"
                    onClick={() => { navigate(`/products?category=${cat.label}`); setMobileMenuOpen(false); }}
                  >
                    <cat.icon className="w-4 h-4 text-[#FF9900]" /> {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
