import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Check, ChevronRight, CreditCard, Truck, MapPin, Shield,
  Package, Clock, Edit, Plus, Lock, Zap, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";
import type { Address } from "../api/client";

type Step = "shipping" | "delivery" | "payment" | "review" | "success";

const savedAddresses = [
  { id: 1, name: "John Smith", line1: "123 Main Street", line2: "Apt 4B", city: "New York", state: "NY", zip: "10001", default: true },
  { id: 2, name: "John Smith", line1: "456 Park Avenue", line2: "", city: "Los Angeles", state: "CA", zip: "90001", default: false },
];

const deliveryOptions = [
  { id: "standard", label: "Standard Delivery", time: "Dec 20-22", price: 0, icon: Truck, desc: "Free shipping" },
  { id: "express", label: "Express Delivery", time: "Tomorrow, Dec 19", price: 9.99, icon: Zap, desc: "Guaranteed next-day" },
  { id: "same-day", label: "Same-Day Delivery", time: "Today by 8 PM", price: 19.99, icon: Clock, desc: "Order within 2h 30m" },
];

const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Shield },
  { id: "applepay", label: "Apple Pay", icon: Lock },
];

const steps: Step[] = ["shipping", "delivery", "payment", "review"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("shipping");
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [addingAddress, setAddingAddress] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [billingDiff, setBillingDiff] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(savedAddresses as any);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.addresses.list().then(setAddresses).catch(() => {});
    }
  }, []);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const order = await api.orders.place(selectedAddress, selectedDelivery, selectedPayment);
        setOrderNumber(order.order_number);
      }
      setStep("success");
    } catch {
      setStep("success");
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = 1569.97;
  const delivery = deliveryOptions.find(d => d.id === selectedDelivery)?.price ?? 0;
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const idx = steps.indexOf(step);
        const isCompleted = i < idx;
        const isCurrent = i === idx;
        const labels = ["Shipping", "Delivery", "Payment", "Review"];
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                isCompleted ? "bg-[#067D62] text-white" : isCurrent ? "bg-[#FF9900] text-[#131921]" : "bg-gray-200 text-gray-500"
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${isCurrent ? "text-[#FF9900]" : isCompleted ? "text-[#067D62]" : "text-gray-400"}`}>
                {labels[i]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mb-4 mx-1 ${isCompleted ? "bg-[#067D62]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-10 shadow-sm text-center max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-[#067D62]/10 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle className="w-10 h-10 text-[#067D62]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
          <p className="text-sm text-gray-400 mb-6">Order #{orderNumber || "SNS-2024-892741"} · Confirmation sent to your email</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="w-5 h-5 text-[#007185] mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm text-[#0F1111]">Estimated Delivery</div>
                <div className="text-[#067D62] font-bold">December 20-22, 2024</div>
                <div className="text-xs text-gray-500 mt-0.5">123 Main Street, Apt 4B, New York, NY 10001</div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t pt-3">
              <Package className="w-5 h-5 text-[#FF9900] flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm text-[#0F1111]">3 items · ₹{total.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Paid via Credit Card ending in 4242</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-3 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-full transition-colors text-sm"
              onClick={() => navigate("/order-tracking")}
            >
              Track Order
            </button>
            <button
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-[#0F1111] font-medium rounded-full transition-colors text-sm"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Secure header */}
      <div className="bg-[#131921] text-white py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xl font-black">ShopNest<span className="text-[#FF9900]">.com</span></span>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Lock className="w-4 h-4 text-[#067D62]" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator />

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === "shipping" && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <h2 className="text-lg font-bold text-[#0F1111] mb-4">Select Delivery Address</h2>
                    <div className="space-y-3 mb-4">
                      {savedAddresses.map(addr => (
                        <label
                          key={addr.id}
                          className={`flex gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedAddress === addr.id ? "border-[#FF9900] bg-[#FF9900]/5" : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddress(addr.id)}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                            selectedAddress === addr.id ? "border-[#FF9900]" : "border-gray-300"
                          }`}>
                            {selectedAddress === addr.id && <div className="w-2.5 h-2.5 bg-[#FF9900] rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#0F1111]">{addr.name}</span>
                              {addr.default && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Default</span>}
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.zip}
                            </p>
                          </div>
                          <button className="text-[#007185] hover:text-[#C7511F]"><Edit className="w-4 h-4" /></button>
                        </label>
                      ))}
                    </div>

                    <button
                      className="flex items-center gap-2 text-[#007185] hover:text-[#C7511F] text-sm font-medium"
                      onClick={() => setAddingAddress(!addingAddress)}
                    >
                      <Plus className="w-4 h-4" /> Add new address
                    </button>

                    {addingAddress && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-4">
                        {["Full Name", "Phone Number", "Address Line 1", "Address Line 2", "City", "State", "ZIP Code", "Country"].map(field => (
                          <input
                            key={field}
                            placeholder={field}
                            className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FF9900] transition-colors ${field === "Address Line 1" || field === "Full Name" ? "sm:col-span-2" : ""}`}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <button
                    className="w-full py-3.5 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-full transition-all"
                    onClick={() => setStep("delivery")}
                  >
                    Continue to Delivery Options
                  </button>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step === "delivery" && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <h2 className="text-lg font-bold text-[#0F1111] mb-4">Choose Delivery Option</h2>
                    <div className="space-y-3">
                      {deliveryOptions.map(opt => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedDelivery === opt.id ? "border-[#FF9900] bg-[#FF9900]/5" : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedDelivery(opt.id)}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            selectedDelivery === opt.id ? "border-[#FF9900]" : "border-gray-300"
                          }`}>
                            {selectedDelivery === opt.id && <div className="w-2.5 h-2.5 bg-[#FF9900] rounded-full" />}
                          </div>
                          <div className={`p-2 rounded-lg ${selectedDelivery === opt.id ? "bg-[#FF9900]/10" : "bg-gray-50"}`}>
                            <opt.icon className={`w-5 h-5 ${selectedDelivery === opt.id ? "text-[#FF9900]" : "text-gray-500"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-[#0F1111]">{opt.label}</div>
                            <div className="text-xs text-gray-500">{opt.desc}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-sm ${opt.price === 0 ? "text-[#067D62]" : "text-[#0F1111]"}`}>
                              {opt.price === 0 ? "FREE" : `₹${opt.price.toFixed(2)}`}
                            </div>
                            <div className="text-xs text-gray-500">{opt.time}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-full font-medium text-sm transition-colors" onClick={() => setStep("shipping")}>
                      Back
                    </button>
                    <button className="flex-1 py-3 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-full transition-all" onClick={() => setStep("payment")}>
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <h2 className="text-lg font-bold text-[#0F1111] mb-4">Payment Method</h2>
                    <div className="flex gap-2 mb-5 flex-wrap">
                      {paymentMethods.map(pm => (
                        <button
                          key={pm.id}
                          className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-medium transition-all ${
                            selectedPayment === pm.id ? "border-[#FF9900] bg-[#FF9900]/5 text-[#131921]" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedPayment(pm.id)}
                        >
                          <pm.icon className="w-4 h-4" /> {pm.label}
                        </button>
                      ))}
                    </div>

                    {selectedPayment === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardDetails.number}
                              onChange={e => setCardDetails(d => ({ ...d, number: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})/g,'$1 ').trim() }))}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF9900] transition-colors pl-11"
                            />
                            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={e => setCardDetails(d => ({ ...d, name: e.target.value }))}
                          placeholder="Cardholder Name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF9900] transition-colors"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={e => setCardDetails(d => ({ ...d, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF9900] transition-colors"
                          />
                          <input
                            type="password"
                            value={cardDetails.cvv}
                            onChange={e => setCardDetails(d => ({ ...d, cvv: e.target.value.slice(0,4) }))}
                            placeholder="CVV"
                            maxLength={4}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF9900] transition-colors"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-[#FF9900]" />
                          <span className="text-sm text-gray-600">Save card for future purchases</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setBillingDiff(!billingDiff)}>
                          <input type="checkbox" checked={billingDiff} onChange={() => {}} className="accent-[#FF9900]" />
                          <span className="text-sm text-gray-600">Billing address is different from shipping</span>
                        </label>
                      </div>
                    )}

                    {selectedPayment === "paypal" && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">You'll be redirected to PayPal to complete payment.</p>
                      </div>
                    )}

                    {selectedPayment === "applepay" && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-600">Complete payment using Apple Pay with Face ID or Touch ID.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-full font-medium text-sm transition-colors" onClick={() => setStep("delivery")}>
                      Back
                    </button>
                    <button className="flex-1 py-3 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-full transition-all" onClick={() => setStep("review")}>
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {step === "review" && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-xl shadow-sm p-5 mb-4 space-y-5">
                    <h2 className="text-lg font-bold text-[#0F1111]">Review Your Order</h2>

                    {/* Summary rows */}
                    {[
                      { label: "Shipping to", value: "123 Main Street, Apt 4B, New York, NY 10001", step: "shipping" },
                      { label: "Delivery", value: `${deliveryOptions.find(d => d.id === selectedDelivery)?.label} · ${deliveryOptions.find(d => d.id === selectedDelivery)?.time}`, step: "delivery" },
                      { label: "Payment", value: `Credit Card ending in 4242`, step: "payment" },
                    ].map(row => (
                      <div key={row.label} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">{row.label}</div>
                          <div className="text-sm text-[#0F1111] font-medium">{row.value}</div>
                        </div>
                        <button
                          className="text-[#007185] hover:text-[#C7511F] text-xs font-medium flex items-center gap-1"
                          onClick={() => setStep(row.step as Step)}
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    ))}

                    {/* Items */}
                    <div>
                      <div className="text-sm font-semibold text-[#0F1111] mb-3">Order Items (3)</div>
                      {[
                        { name: "Apple iPhone 15 Pro Max 256GB", price: 1199.99, image: "https://images.unsplash.com/photo-1695048132971-e4dc9c5f22e3?w=80&h=80&fit=crop&auto=format", qty: 1 },
                        { name: "Sony WH-1000XM5 Headphones", price: 279.99, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&h=80&fit=crop&auto=format", qty: 1 },
                        { name: "Nike Air Max 270 React", price: 89.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&auto=format", qty: 2 },
                      ].map(item => (
                        <div key={item.name} className="flex items-center gap-3 py-2">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[#0F1111] line-clamp-1">{item.name}</div>
                            <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                          </div>
                          <div className="text-sm font-semibold">₹{(item.price * item.qty).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-full font-medium text-sm transition-colors" onClick={() => setStep("payment")}>
                      Back
                    </button>
                    <button
                      className="flex-1 py-3 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-full transition-all disabled:opacity-60"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? "Placing Order..." : `Place Order · ₹${total.toFixed(2)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-[#0F1111] mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className={delivery === 0 ? "text-[#067D62]" : ""}>{delivery === 0 ? "FREE" : `₹${delivery.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
                  <span>Order Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5 text-[#067D62]" />
                Secure SSL encrypted payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
