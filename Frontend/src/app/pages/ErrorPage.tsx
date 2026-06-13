import { useNavigate, useSearchParams } from "react-router";
import { Home, RotateCcw, Search, ShoppingCart, Heart, Wifi, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

type ErrorType = "404" | "empty-cart" | "empty-wishlist" | "no-orders" | "no-results" | "network" | "server";

interface ErrorConfig {
  icon: any;
  iconColor: string;
  title: string;
  subtitle: string;
  actions: { label: string; primary?: boolean; path: string }[];
  emoji: string;
}

const errorConfigs: Record<ErrorType, ErrorConfig> = {
  "404": {
    icon: AlertTriangle,
    iconColor: "text-[#FF9900]",
    title: "Page Not Found",
    subtitle: "Oops! The page you're looking for doesn't exist or has been moved.",
    actions: [
      { label: "Go Home", primary: true, path: "/" },
      { label: "Browse Products", path: "/products" },
    ],
    emoji: "🔍",
  },
  "empty-cart": {
    icon: ShoppingCart,
    iconColor: "text-gray-300",
    title: "Your cart is empty",
    subtitle: "Looks like you haven't added anything yet. Discover great products and start shopping!",
    actions: [
      { label: "Start Shopping", primary: true, path: "/products" },
      { label: "View Wishlist", path: "/wishlist" },
    ],
    emoji: "🛒",
  },
  "empty-wishlist": {
    icon: Heart,
    iconColor: "text-gray-300",
    title: "Your wishlist is empty",
    subtitle: "Save products you love to your wishlist and revisit them anytime.",
    actions: [
      { label: "Discover Products", primary: true, path: "/products" },
      { label: "View Deals", path: "/products?filter=deals" },
    ],
    emoji: "❤️",
  },
  "no-orders": {
    icon: ShoppingCart,
    iconColor: "text-gray-300",
    title: "No orders yet",
    subtitle: "You haven't placed any orders yet. Start exploring our amazing products!",
    actions: [
      { label: "Shop Now", primary: true, path: "/products" },
      { label: "View Deals", path: "/products?filter=deals" },
    ],
    emoji: "📦",
  },
  "no-results": {
    icon: Search,
    iconColor: "text-gray-300",
    title: "No results found",
    subtitle: "We couldn't find what you're looking for. Try different keywords or browse our categories.",
    actions: [
      { label: "Browse All", primary: true, path: "/products" },
      { label: "Try Again", path: "/search" },
    ],
    emoji: "🔎",
  },
  "network": {
    icon: Wifi,
    iconColor: "text-[#CC0C39]",
    title: "Connection Error",
    subtitle: "Unable to connect to the internet. Please check your connection and try again.",
    actions: [
      { label: "Retry", primary: true, path: "/" },
      { label: "Go Offline Mode", path: "/" },
    ],
    emoji: "📡",
  },
  "server": {
    icon: AlertTriangle,
    iconColor: "text-[#CC0C39]",
    title: "Something went wrong",
    subtitle: "We're experiencing technical difficulties. Our team has been notified and is working on a fix.",
    actions: [
      { label: "Refresh Page", primary: true, path: "/" },
      { label: "Contact Support", path: "/support" },
    ],
    emoji: "⚠️",
  },
};

export default function ErrorPage({ type = "404" }: { type?: ErrorType }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorType = (searchParams.get("type") as ErrorType) || type;
  const config = errorConfigs[errorType] || errorConfigs["404"];

  const suggestions = [
    { name: "Today's Deals", path: "/products?filter=deals" },
    { name: "Best Sellers", path: "/products?filter=bestseller" },
    { name: "New Arrivals", path: "/products?filter=new" },
    { name: "Your Account", path: "/account" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-8xl mb-6"
        >
          {config.emoji}
        </motion.div>

        {errorType === "404" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black text-gray-100 mb-2 tracking-tighter"
          >
            404
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-[#0F1111] mb-3">{config.title}</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">{config.subtitle}</p>

          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {config.actions.map(action => (
              <button
                key={action.label}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all hover:shadow-md flex items-center gap-2 ${
                  action.primary
                    ? "bg-[#FF9900] hover:bg-[#E88B00] text-[#131921]"
                    : "border border-gray-300 text-[#0F1111] hover:bg-gray-50"
                }`}
                onClick={() => {
                  if (action.label === "Retry" || action.label === "Refresh Page") {
                    window.location.reload();
                  } else {
                    navigate(action.path);
                  }
                }}
              >
                {action.label === "Go Home" && <Home className="w-4 h-4" />}
                {action.label === "Retry" && <RotateCcw className="w-4 h-4" />}
                {action.label === "Refresh Page" && <RotateCcw className="w-4 h-4" />}
                {action.label}
              </button>
            ))}
          </div>

          {/* Helpful links */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-left">
            <p className="text-sm font-semibold text-gray-500 mb-3 text-center">You might also like</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map(link => (
                <button
                  key={link.name}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors text-sm text-[#007185] hover:text-[#C7511F] font-medium"
                  onClick={() => navigate(link.path)}
                >
                  <div className="w-1.5 h-1.5 bg-[#FF9900] rounded-full flex-shrink-0" />
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
