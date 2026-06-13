import { useNavigate } from "react-router";
import {
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Smartphone, Shield, Truck, RotateCcw, Headphones,
  CreditCard, Apple, Chrome
} from "lucide-react";

const footerLinks = {
  "Get to Know Us": ["Careers", "Blog", "About ShopNest", "Investor Relations", "ShopNest Devices", "ShopNest Science"],
  "Make Money with Us": ["Sell on ShopNest", "Sell Under ShopNest", "Become an Affiliate", "Advertise Your Products", "Self-Publish", "Host an ShopNest Hub"],
  "ShopNest Payment Products": ["ShopNest Business Card", "Shop with Points", "Reload Your Balance", "ShopNest Currency Converter"],
  "Let Us Help You": ["ShopNest and COVID-19", "Your Account", "Your Orders", "Shipping Rates & Policies", "Returns & Replacements", "Manage Your Content", "ShopNest Assistant", "Help"],
};

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      {/* Back to top */}
      <div
        className="bg-[#37475A] hover:bg-[#485769] text-white text-center py-3.5 text-sm cursor-pointer transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </div>

      {/* Trust badges */}
      <div className="bg-[#232F3E] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over $25" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure payments" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated support" },
            ].map(badge => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="bg-[#FF9900]/20 rounded-full p-2.5 flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-[#FF9900]" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{badge.title}</div>
                  <div className="text-xs text-gray-400">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="bg-[#131921] text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-bold text-sm mb-3 text-white">{section}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}>
                      <button className="text-gray-400 hover:text-white text-xs transition-colors text-left">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="cursor-pointer" onClick={() => navigate("/")}>
                <div className="flex flex-col leading-none">
                  <span className="text-white text-xl font-black tracking-tight">ShopNest</span>
                  <span className="text-[#FF9900] text-xs font-semibold tracking-widest">.com</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF9900] hover:text-[#131921] flex items-center justify-center transition-all duration-200 text-gray-400"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* App badges */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  <Apple className="w-4 h-4" />
                  <div className="text-left leading-tight">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-xs font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
                  <Chrome className="w-4 h-4" />
                  <div className="text-left leading-tight">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-xs font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment methods */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <CreditCard className="w-4 h-4" />
                <span>We accept</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["VISA", "MC", "AMEX", "PayPal", "Apple Pay", "Google Pay", "Discover"].map(pm => (
                  <span key={pm} className="bg-white text-[#131921] text-xs font-bold px-2.5 py-1 rounded">
                    {pm}
                  </span>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="mt-8 flex flex-col items-center gap-3 text-xs text-gray-500">
              <div className="flex flex-wrap justify-center gap-3">
                {["Conditions of Use", "Privacy Notice", "Interest-Based Ads", "Cookie Notice", "Accessibility"].map(item => (
                  <button key={item} className="hover:text-gray-300 transition-colors">{item}</button>
                ))}
              </div>
              <p>© 2024-2025 ShopNest. All rights reserved.</p>
              <p className="text-center max-w-lg">ShopNest is a fictional e-commerce platform created for demonstration purposes. All product listings, prices, and reviews are simulated data.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
