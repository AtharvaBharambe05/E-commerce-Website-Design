import { useNavigate } from "react-router";
import {
  Package, Truck, CheckCircle, MapPin, ChevronRight, Phone,
  Clock, Star, Download, RotateCcw, MessageCircle
} from "lucide-react";
import { motion } from "motion/react";

const trackingSteps = [
  { id: 1, label: "Order Placed", time: "Dec 18, 2024 · 10:23 AM", detail: "Your order has been confirmed and payment processed.", done: true, icon: Package },
  { id: 2, label: "Order Processed", time: "Dec 18, 2024 · 2:45 PM", detail: "Your order has been packed and is ready for pickup.", done: true, icon: CheckCircle },
  { id: 3, label: "Shipped", time: "Dec 19, 2024 · 9:10 AM", detail: "Your package has been picked up by FedEx. Tracking: FX1234567890", done: true, icon: Truck },
  { id: 4, label: "Out for Delivery", time: "Dec 20, 2024 · 8:30 AM", detail: "Your package is with the delivery agent and will arrive today.", done: true, icon: Truck },
  { id: 5, label: "Delivered", time: "Expected by 8 PM today", detail: "Estimated delivery: December 20, 2024", done: false, icon: CheckCircle },
];

const orderItems = [
  { name: "Apple iPhone 15 Pro Max 256GB Natural Titanium", price: 1199.99, qty: 1, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=120&h=120&fit=crop&auto=format" },
  { name: "Sony WH-1000XM5 Wireless Headphones", price: 279.99, qty: 1, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&h=120&fit=crop&auto=format" },
];

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const currentStep = 4;

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-[#007185]">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate("/account")} className="hover:text-[#007185]">My Account</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0F1111] font-medium">Order Tracking</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Order header */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#0F1111] mb-1">Track Your Order</h1>
              <div className="text-sm text-gray-500">Order #SNS-2024-892741 · Placed Dec 18, 2024</div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-sm border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> Invoice
              </button>
              <button className="flex items-center gap-1.5 text-sm border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <RotateCcw className="w-4 h-4" /> Return
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Order Placed</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FF9900] to-[#067D62] rounded-full"
              />
            </div>
            <div className="flex justify-between mt-1.5">
              {trackingSteps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center -mt-3.5 ${
                    i < currentStep
                      ? "bg-[#067D62] border-[#067D62]"
                      : i === currentStep
                      ? "bg-[#FF9900] border-[#FF9900] animate-pulse"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {i < currentStep && <CheckCircle className="w-3 h-3 text-white" />}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Current status highlight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 bg-[#FF9900]/10 border border-[#FF9900]/30 rounded-xl p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-[#FF9900]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-[#FF9900]" />
            </div>
            <div>
              <div className="font-bold text-[#0F1111]">Out for Delivery</div>
              <div className="text-sm text-gray-600 mt-0.5">Your package is with the delivery agent. Expected by <span className="text-[#067D62] font-bold">8:00 PM today</span></div>
              <div className="text-xs text-gray-500 mt-1">FedEx · Tracking: FX1234567890</div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-[#0F1111] mb-5">Shipment Timeline</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />

              <div className="space-y-5">
                {trackingSteps.map((step, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 relative"
                    >
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center z-10 ${
                        isDone ? "bg-[#067D62]" : isActive ? "bg-[#FF9900]" : "bg-gray-100"
                      }`}>
                        <step.icon className={`w-4 h-4 ${isDone || isActive ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <div className={`pb-2 ${!isActive && !isDone ? "opacity-50" : ""}`}>
                        <div className={`font-semibold text-sm ${isActive ? "text-[#FF9900]" : isDone ? "text-[#067D62]" : "text-gray-400"}`}>
                          {step.label}
                          {isActive && <span className="ml-2 text-xs bg-[#FF9900]/10 text-[#FF9900] px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{step.time}</div>
                        <div className="text-xs text-gray-600 mt-1">{step.detail}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Delivery info */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-[#0F1111] mb-4">Delivery Details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF9900] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-[#0F1111]">Delivering to</div>
                    <div className="text-xs text-gray-500 mt-0.5">John Smith · 123 Main Street, Apt 4B, New York, NY 10001</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FF9900] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-[#0F1111]">Estimated Delivery</div>
                    <div className="text-xs text-[#067D62] font-bold mt-0.5">Today, December 20, 2024 · By 8 PM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-[#FF9900] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-[#0F1111]">Shipped by</div>
                    <div className="text-xs text-gray-500 mt-0.5">FedEx Express · FX1234567890</div>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-2.5 text-sm font-medium transition-colors">
                <Phone className="w-4 h-4" /> Contact Delivery Agent
              </button>
            </div>

            {/* Items in this order */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-[#0F1111] mb-4">Items in This Order</h2>
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.name} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg bg-gray-50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#0F1111] line-clamp-2">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Qty: {item.qty}</div>
                    </div>
                    <div className="text-sm font-bold text-[#0F1111] flex-shrink-0">₹{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-[#0F1111]">Order Total</span>
                <span className="font-bold text-[#0F1111]">₹1,56,997</span>
              </div>
            </div>

            {/* Rate delivery */}
            <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-[#FF9900]" />
                <span className="font-semibold">How's your experience?</span>
              </div>
              <p className="text-gray-300 text-xs mb-4">Rate your delivery experience to help us improve.</p>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button key={s} className="text-2xl hover:scale-110 transition-transform">
                    {s <= 4 ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              <button className="w-full py-2.5 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl text-sm transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
