import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import SupportPage from "./pages/SupportPage";
import NotificationsPage from "./pages/NotificationsPage";
import ErrorPage from "./pages/ErrorPage";

// Pages that have their own full-screen layout (no standard header/footer)
const standalonePages = ["/auth", "/checkout"];

function AppLayout({ darkMode, onToggleDark }: { darkMode: boolean; onToggleDark: () => void }) {
  const location = useLocation();
  const isStandalone = standalonePages.some(p => location.pathname.startsWith(p));

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {!isStandalone && <Header darkMode={darkMode} onToggleDark={onToggleDark} />}

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/order-tracking" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<ErrorPage type="404" />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {!isStandalone && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />
      </AuthProvider>
    </BrowserRouter>
  );
}
