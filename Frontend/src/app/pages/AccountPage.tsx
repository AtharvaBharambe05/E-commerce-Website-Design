import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  User, Package, Heart, Bell, Shield, MapPin, CreditCard,
  ChevronRight, Edit, Camera, Star, Truck, CheckCircle,
  Clock, XCircle, Settings, LogOut, Eye, BarChart3
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "../api/client";
import type { Order, Address, UserProfile } from "../api/client";
import { useAuth } from "../context/AuthContext";

type Tab = "overview" | "orders" | "addresses" | "payment" | "notifications" | "security" | "profile";

const orders = [
  { id: "SNS-2024-892741", date: "Dec 18, 2024", items: 3, total: 1569.97, status: "Delivered", statusColor: "text-[#067D62]", statusBg: "bg-[#067D62]/10", icon: CheckCircle, tracking: "Out for Delivery", image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=80&h=80&fit=crop&auto=format" },
  { id: "SNS-2024-784521", date: "Dec 10, 2024", items: 1, total: 279.99, status: "In Transit", statusColor: "text-[#007185]", statusBg: "bg-[#007185]/10", icon: Truck, tracking: "Shipped", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&h=80&fit=crop&auto=format" },
  { id: "SNS-2024-673210", date: "Nov 28, 2024", items: 2, total: 449.98, status: "Delivered", statusColor: "text-[#067D62]", statusBg: "bg-[#067D62]/10", icon: CheckCircle, tracking: "Delivered Nov 30", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&auto=format" },
  { id: "SNS-2024-531087", date: "Nov 15, 2024", items: 1, total: 1299.99, status: "Cancelled", statusColor: "text-[#CC0C39]", statusBg: "bg-[#CC0C39]/10", icon: XCircle, tracking: "Refunded", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop&auto=format" },
];

const addresses = [
  { id: 1, name: "John Smith", line: "123 Main Street, Apt 4B", city: "New York, NY 10001", phone: "+1 (555) 234-5678", default: true },
  { id: 2, name: "John Smith", line: "456 Park Avenue", city: "Los Angeles, CA 90001", phone: "+1 (555) 234-5678", default: false },
];

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "profile", label: "Profile", icon: User },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
  const [apiAddresses, setApiAddresses] = useState<Address[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.user.getProfile().then(setProfile).catch(() => {});
    api.orders.list().then(setApiOrders).catch(() => {});
    api.addresses.list().then(setApiAddresses).catch(() => {});
  }, []);

  const displayOrders = apiOrders.length > 0 ? apiOrders.map(o => ({
    id: o.order_number,
    date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    items: o.items.length,
    total: o.total,
    status: o.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    statusColor: o.status === "delivered" ? "text-[#067D62]" : o.status === "cancelled" ? "text-[#CC0C39]" : "text-[#007185]",
    statusBg: o.status === "delivered" ? "bg-[#067D62]/10" : o.status === "cancelled" ? "bg-[#CC0C39]/10" : "bg-[#007185]/10",
    icon: o.status === "delivered" ? CheckCircle : o.status === "cancelled" ? XCircle : Truck,
    tracking: o.status.replace(/_/g, " "),
    image: o.items[0]?.product_image ?? "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=80&h=80&fit=crop&auto=format",
  })) : orders;

  const displayAddresses = apiAddresses.length > 0 ? apiAddresses.map(a => ({
    id: a.id, name: a.name, line: a.line1, city: `${a.city}, ${a.state} ${a.zip}`,
    phone: a.phone ?? "", default: a.is_default,
  })) : addresses;

  const displayName = profile?.name ?? "John Smith";
  const displayEmail = profile?.email ?? "john@email.com";

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-5 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Profile summary */}
              <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-[#FF9900] flex items-center justify-center text-2xl font-bold text-[#131921]">
                      J
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                      <Camera className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <div className="font-bold">{displayName}</div>
                    <div className="text-gray-300 text-xs">{displayEmail}</div>
                    <div className="text-[#FF9900] text-xs font-semibold flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-current" /> Prime Member
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                      activeTab === tab.key
                        ? "bg-[#FF9900]/10 text-[#FF9900] font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <tab.icon className="w-4.5 h-4.5" />
                    {tab.label}
                    {tab.key === "orders" && (
                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{displayOrders.length}</span>
                    )}
                  </button>
                ))}
                <div className="border-t mt-2 pt-2">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#CC0C39] hover:bg-red-50 transition-all"
                    onClick={() => { logout(); navigate("/auth"); }}
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h1 className="text-2xl font-bold text-[#0F1111]">Welcome back, {displayName.split(" ")[0]}!</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Orders", value: "24", icon: Package, color: "text-[#007185] bg-[#007185]/10" },
                    { label: "Wishlist Items", value: "12", icon: Heart, color: "text-[#CC0C39] bg-red-50" },
                    { label: "Points Earned", value: "2,450", icon: Star, color: "text-[#FFA41C] bg-amber-50" },
                    { label: "Saved Amount", value: "₹386", icon: CreditCard, color: "text-[#067D62] bg-[#067D62]/10" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className={`${stat.color} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
                        <stat.icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-2xl font-bold text-[#0F1111]">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-[#0F1111]">Recent Orders</h2>
                    <button className="text-[#007185] hover:text-[#C7511F] text-sm flex items-center gap-1" onClick={() => setActiveTab("orders")}>
                      View all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {displayOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => navigate("/order-tracking")}>
                        <img src={order.image} alt="" className="w-12 h-12 object-contain rounded-lg bg-gray-50" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#0F1111]">{order.id}</div>
                          <div className="text-xs text-gray-500">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</div>
                          <div className={`text-xs font-semibold mt-0.5 ${order.statusColor}`}>{order.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm text-[#0F1111]">₹{order.total}</div>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Track Package", icon: Truck, path: "/order-tracking", color: "text-[#007185]" },
                    { label: "Return Item", icon: Clock, path: "/support", color: "text-[#CC0C39]" },
                    { label: "Contact Support", icon: Settings, path: "/support", color: "text-[#232F3E]" },
                  ].map(action => (
                    <button
                      key={action.label}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 text-left"
                      onClick={() => navigate(action.path)}
                    >
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      <span className="text-sm font-medium text-[#0F1111]">{action.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#0F1111] mb-4">My Orders</h1>
                <div className="space-y-3">
                  {displayOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                          <span>ORDER PLACED <span className="text-[#0F1111] font-semibold ml-1">{order.date}</span></span>
                          <span>TOTAL <span className="text-[#0F1111] font-semibold ml-1">₹{order.total}</span></span>
                          <span>ORDER <span className="text-[#0F1111] font-semibold ml-1">#{order.id}</span></span>
                        </div>
                        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.statusBg} ${order.statusColor}`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="p-4 flex items-center gap-4">
                        <img src={order.image} alt="" className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-[#0F1111]">{order.items} item{order.items > 1 ? "s" : ""}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <order.icon className={`w-3.5 h-3.5 ${order.statusColor}`} />
                            <span className={`text-xs font-medium ${order.statusColor}`}>{order.tracking}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {order.status !== "Cancelled" && (
                            <button className="text-[#007185] hover:text-[#C7511F] text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                              onClick={() => navigate("/order-tracking")}>
                              <Eye className="w-3.5 h-3.5" /> Track
                            </button>
                          )}
                          <button className="text-[#007185] hover:text-[#C7511F] text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            Buy Again
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-[#0F1111]">Saved Addresses</h1>
                  <button className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold px-4 py-2 rounded-full text-sm transition-colors">
                    + Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayAddresses.map(addr => (
                    <div key={addr.id} className="bg-white rounded-xl shadow-sm p-5 relative">
                      {addr.default && (
                        <span className="absolute top-3 right-3 text-xs bg-[#067D62]/10 text-[#067D62] px-2 py-0.5 rounded-full font-semibold">
                          Default
                        </span>
                      )}
                      <div className="font-bold text-[#0F1111] mb-1">{addr.name}</div>
                      <div className="text-sm text-gray-600 mb-0.5">{addr.line}</div>
                      <div className="text-sm text-gray-600 mb-0.5">{addr.city}</div>
                      <div className="text-sm text-gray-600 mb-4">{addr.phone}</div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 text-[#007185] hover:text-[#C7511F] text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        {!addr.default && (
                          <button className="text-[#CC0C39] text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#0F1111] mb-4">Personal Information</h1>
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-[#FF9900] flex items-center justify-center text-3xl font-bold text-[#131921]">J</div>
                      <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center shadow">
                        <Camera className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-[#0F1111]">John Smith</div>
                      <div className="text-gray-500 text-sm">Member since January 2022</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "First Name", value: "John" },
                      { label: "Last Name", value: "Smith" },
                      { label: "Email Address", value: "john@email.com" },
                      { label: "Phone Number", value: "+1 (555) 234-5678" },
                      { label: "Date of Birth", value: "January 15, 1990" },
                      { label: "Gender", value: "Male" },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{field.label}</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
                          <span className="flex-1 text-sm text-[#0F1111]">{field.value}</span>
                          <button className="text-[#007185] hover:text-[#C7511F]"><Edit className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl transition-colors text-sm">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#0F1111] mb-4">Security Settings</h1>
                <div className="space-y-3">
                  {[
                    { title: "Password", desc: "Last changed 3 months ago", action: "Change Password" },
                    { title: "Two-Factor Authentication", desc: "Add an extra layer of security", action: "Enable 2FA" },
                    { title: "Login History", desc: "View your recent sign-in activity", action: "View History" },
                    { title: "Connected Apps", desc: "Google, Apple", action: "Manage Apps" },
                  ].map(item => (
                    <div key={item.title} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-[#0F1111]">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                      </div>
                      <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#0F1111] mb-4">Notification Preferences</h1>
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="space-y-4">
                    {[
                      { title: "Order Updates", desc: "Get notified about your order status", email: true, push: true, sms: false },
                      { title: "Deals & Promotions", desc: "Exclusive offers and discounts", email: true, push: false, sms: false },
                      { title: "Price Drops", desc: "When items in your wishlist go on sale", email: true, push: true, sms: true },
                      { title: "New Arrivals", desc: "Latest products in your favorite categories", email: false, push: true, sms: false },
                      { title: "Security Alerts", desc: "Sign-in attempts and account changes", email: true, push: true, sms: true },
                    ].map(pref => (
                      <div key={pref.title} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-semibold text-sm text-[#0F1111]">{pref.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{pref.desc}</div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                          {[{ key: "email", label: "E" }, { key: "push", label: "P" }, { key: "sms", label: "S" }].map(ch => (
                            <label key={ch.key} className="flex flex-col items-center gap-1 cursor-pointer">
                              <span className="text-xs text-gray-400">{ch.key}</span>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${pref[ch.key as keyof typeof pref] ? "bg-[#FF9900]" : "bg-gray-200"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${pref[ch.key as keyof typeof pref] ? "left-5" : "left-0.5"}`} />
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "payment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-[#0F1111]">Payment Methods</h1>
                  <button className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold px-4 py-2 rounded-full text-sm transition-colors">
                    + Add Card
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { type: "Visa", last4: "4242", expires: "12/26", default: true, color: "from-[#1a1f71] to-[#00479d]" },
                    { type: "Mastercard", last4: "5555", expires: "08/25", default: false, color: "from-[#eb001b] to-[#f79e1b]" },
                  ].map(card => (
                    <div key={card.last4} className={`bg-gradient-to-r ${card.color} rounded-2xl p-5 text-white relative overflow-hidden`}>
                      <div className="absolute right-4 top-4 opacity-20 text-6xl font-black">{card.type}</div>
                      {card.default && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">Default</span>}
                      <div className="text-lg tracking-widest font-mono mt-2 mb-4">•••• •••• •••• {card.last4}</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-70">Card Holder</div>
                          <div className="font-semibold">John Smith</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-70">Expires</div>
                          <div className="font-semibold">{card.expires}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button className="text-xs bg-white/20 hover:bg-red-500/40 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
