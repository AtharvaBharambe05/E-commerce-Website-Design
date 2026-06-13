import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell, Package, Tag, Star, Shield, Truck, Check, Trash2,
  Settings, ChevronRight, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Notification {
  id: number;
  type: "order" | "deal" | "review" | "security" | "delivery";
  title: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
}

const icons = {
  order: { icon: Package, color: "bg-blue-50 text-blue-600" },
  deal: { icon: Tag, color: "bg-amber-50 text-amber-600" },
  review: { icon: Star, color: "bg-yellow-50 text-yellow-600" },
  security: { icon: Shield, color: "bg-purple-50 text-purple-600" },
  delivery: { icon: Truck, color: "bg-green-50 text-green-600" },
};

const initialNotifications: Notification[] = [
  { id: 1, type: "delivery", title: "Your order is out for delivery!", message: "Order #SNS-2024-892741 is with the delivery agent and will arrive today by 8 PM.", time: "5 minutes ago", read: false, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=60&h=60&fit=crop&auto=format" },
  { id: 2, type: "deal", title: "Flash Sale: 40% off Sony Headphones", message: "Sony WH-1000XM5 is now ₹14,999 — down from ₹29,999. Limited stock available!", time: "1 hour ago", read: false, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=60&h=60&fit=crop&auto=format" },
  { id: 3, type: "order", title: "Order placed successfully", message: "Your order for iPhone 15 Pro Max has been confirmed. Expected delivery: Dec 20-22.", time: "3 hours ago", read: false },
  { id: 4, type: "deal", title: "Price drop on your wishlist item!", message: "MacBook Air M3 dropped by ₹16,000. Now ₹1,07,999. Add to cart before it's gone!", time: "Yesterday, 4:30 PM", read: true, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=60&h=60&fit=crop&auto=format" },
  { id: 5, type: "review", title: "Rate your recent purchase", message: "How was your experience with Nike Air Max 270? Share your review to help others.", time: "Yesterday, 10:15 AM", read: true },
  { id: 6, type: "security", title: "New sign-in detected", message: "A new device signed into your account from New York, NY. If this wasn't you, secure your account.", time: "2 days ago", read: true },
  { id: 7, type: "delivery", title: "Your package has shipped!", message: "Order #SNS-2024-784521 is on its way. Tracking: FX9876543210.", time: "3 days ago", read: true },
  { id: 8, type: "deal", title: "Your Prime renewal is coming up", message: "Your Prime membership renews on Jan 1, 2025 for ₹1,299/month. Manage subscription.", time: "4 days ago", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "orders" | "deals">("all");
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "orders") return n.type === "order" || n.type === "delivery";
    if (filter === "deals") return n.type === "deal";
    return true;
  });

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const remove = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#0F1111] flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#FF9900]" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm font-normal bg-[#CC0C39] text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </h1>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                className="flex items-center gap-1.5 text-sm text-[#007185] hover:text-[#C7511F] border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={markAllRead}
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => navigate("/account?tab=notifications")}>
              <Settings className="w-4.5 h-4.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-4 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: `Unread (${unreadCount})` },
            { key: "orders", label: "Orders" },
            { key: "deals", label: "Deals" },
          ].map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === tab.key
                  ? "bg-[#FF9900] text-[#131921]"
                  : "text-gray-500 hover:text-[#0F1111]"
              }`}
              onClick={() => setFilter(tab.key as typeof filter)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#0F1111] mb-2">You're all caught up!</h2>
            <p className="text-gray-500 text-sm">No {filter === "all" ? "" : filter} notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map(notif => {
                const { icon: Icon, color } = icons[notif.type];
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all group ${!notif.read ? "border-l-4 border-[#FF9900]" : ""}`}
                    onClick={() => markRead(notif.id)}
                  >
                    <div className="p-4 flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm ${!notif.read ? "font-semibold text-[#0F1111]" : "font-medium text-[#0F1111]"}`}>
                              {notif.title}
                              {!notif.read && <span className="ml-2 inline-block w-2 h-2 bg-[#FF9900] rounded-full align-middle" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                            <div className="text-xs text-gray-400 mt-1.5">{notif.time}</div>
                          </div>
                          {notif.image && (
                            <img src={notif.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-50" />
                          )}
                        </div>

                        {/* Actions */}
                        {notif.type === "delivery" && (
                          <button
                            className="mt-2 text-xs text-[#007185] hover:text-[#C7511F] font-medium flex items-center gap-1"
                            onClick={e => { e.stopPropagation(); navigate("/order-tracking"); }}
                          >
                            Track Package <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {notif.type === "deal" && (
                          <button
                            className="mt-2 text-xs text-[#007185] hover:text-[#C7511F] font-medium flex items-center gap-1"
                            onClick={e => { e.stopPropagation(); navigate("/products?filter=deals"); }}
                          >
                            View Deal <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1 text-gray-300 hover:text-[#CC0C39] transition-all"
                        onClick={e => { e.stopPropagation(); remove(notif.id); }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
