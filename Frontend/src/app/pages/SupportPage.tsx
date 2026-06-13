import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MessageCircle, Phone, Mail, ChevronDown, ChevronUp, ChevronRight,
  Package, RotateCcw, CreditCard, Truck, Shield, HelpCircle,
  Search, Send, X, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqCategories = [
  { icon: Package, label: "Orders & Returns", color: "text-blue-600 bg-blue-50" },
  { icon: Truck, label: "Shipping & Delivery", color: "text-green-600 bg-green-50" },
  { icon: CreditCard, label: "Payments & Refunds", color: "text-purple-600 bg-purple-50" },
  { icon: Shield, label: "Account & Security", color: "text-orange-600 bg-orange-50" },
  { icon: RotateCcw, label: "Product Returns", color: "text-red-600 bg-red-50" },
  { icon: HelpCircle, label: "General Help", color: "text-gray-600 bg-gray-50" },
];

const faqs = [
  { q: "How do I track my order?", a: "You can track your order by visiting 'My Account' > 'My Orders' and clicking on the order you want to track. You'll see real-time tracking updates there.", category: "Orders & Returns" },
  { q: "What is the return policy?", a: "Most items can be returned within 30 days of delivery. Items must be in original condition with all tags attached. Some categories like perishables or digital downloads are not eligible for return.", category: "Orders & Returns" },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-7 business days. Prime members get free 2-day delivery on eligible items. Same-day delivery is available in select areas.", category: "Shipping & Delivery" },
  { q: "Is it safe to save my payment information?", a: "Yes, we use bank-grade 256-bit SSL encryption to protect your payment information. Your card details are never stored on our servers.", category: "Payments & Refunds" },
  { q: "How do I get a refund?", a: "Once your return is received and inspected, your refund will be processed within 3-5 business days. The refund will appear on your original payment method.", category: "Payments & Refunds" },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 30 minutes of placing them. After that, you may need to wait for delivery and then initiate a return.", category: "Orders & Returns" },
];

interface ChatMessage {
  id: number;
  from: "user" | "bot";
  text: string;
  time: string;
}

const botResponses = [
  "I understand your concern. Let me help you with that! Could you provide your order number so I can look into it?",
  "Thank you for reaching out! Our team is committed to resolving your issue as quickly as possible.",
  "I can definitely help you with that. Based on your account, I can see your recent orders. Which one are you referring to?",
  "That's a great question! Our return policy allows returns within 30 days for most items. Would you like me to initiate a return for you?",
  "I've escalated your issue to our specialist team. You'll receive an email update within 2 hours.",
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "bot", text: "Hi! I'm ShopNest's virtual assistant. How can I help you today?", time: "Just now" }
  ]);
  const [botTyping, setBotTyping] = useState(false);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), from: "user", text: chatInput, time: "Just now" };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setBotTyping(true);
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        time: "Just now"
      };
      setMessages(prev => [...prev, botMsg]);
      setBotTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const filteredFaqs = faqs.filter(f =>
    (activeCategory === "All" || f.category === activeCategory) &&
    (searchQuery === "" || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-black mb-3">How can we help you?</h1>
          <p className="text-gray-300 mb-6">Find answers quickly or connect with our support team</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-[#0F1111] outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Contact options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, title: "Live Chat", desc: "Chat with us now", action: "Start Chat", color: "bg-[#FF9900]", onClick: () => setChatOpen(true) },
            { icon: Phone, title: "Call Us", desc: "Mon-Fri, 8AM-8PM EST", action: "1-800-SHOPNEST", color: "bg-[#007185]", onClick: () => {} },
            { icon: Mail, title: "Email Support", desc: "Response within 24 hours", action: "Send Email", color: "bg-[#232F3E]", onClick: () => {} },
          ].map(opt => (
            <div key={opt.title} className="bg-white rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition-shadow">
              <div className={`${opt.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <opt.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#0F1111] mb-1">{opt.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{opt.desc}</p>
              <button
                className={`${opt.color} hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all w-full`}
                onClick={opt.onClick}
              >
                {opt.action}
              </button>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-[#0F1111] mb-4">Browse Help Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {faqCategories.map(cat => (
              <button
                key={cat.label}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  activeCategory === cat.label
                    ? "border-[#FF9900] bg-[#FF9900]/5"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setActiveCategory(activeCategory === cat.label ? "All" : cat.label)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <cat.icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-medium text-[#0F1111]">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0F1111]">Frequently Asked Questions</h2>
            {activeCategory !== "All" && (
              <button className="text-[#007185] text-sm hover:text-[#C7511F]" onClick={() => setActiveCategory("All")}>
                Clear filter
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10">
              <HelpCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No FAQs match your search. Try different keywords or contact support.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4">
                      <HelpCircle className="w-4 h-4 text-[#FF9900] flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-sm text-[#0F1111]">{faq.q}</span>
                    </div>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 pl-11">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat bubble */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF9900] hover:bg-[#E88B00] rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-40"
        onClick={() => setChatOpen(true)}
      >
        <MessageCircle className="w-6 h-6 text-[#131921]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC0C39] rounded-full text-white text-xs flex items-center justify-center">1</span>
      </button>

      {/* Live chat modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ height: 480 }}
          >
            {/* Chat header */}
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FF9900] rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#131921]" />
                </div>
                <div>
                  <div className="font-semibold text-sm">ShopNest Support</div>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <button className="hover:bg-white/10 rounded-full p-1.5 transition-colors" onClick={() => setChatOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {msg.from === "bot" && (
                    <div className="w-7 h-7 bg-[#FF9900] rounded-full flex items-center justify-center flex-shrink-0 mt-auto">
                      <MessageCircle className="w-3.5 h-3.5 text-[#131921]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2.5 rounded-2xl text-sm ${
                      msg.from === "user"
                        ? "bg-[#FF9900] text-[#131921] rounded-br-sm"
                        : "bg-white text-[#0F1111] rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.from === "user" && (
                    <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-auto">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {botTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-[#FF9900] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-[#131921]" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:bg-gray-50"
                />
                <button
                  className="w-9 h-9 bg-[#FF9900] hover:bg-[#E88B00] rounded-xl flex items-center justify-center transition-colors"
                  onClick={sendMessage}
                >
                  <Send className="w-4 h-4 text-[#131921]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
