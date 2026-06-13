import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "signup" | "forgot" | "reset";

// --- Moved outside component to prevent remount on every render ---
function FormCard({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 w-full max-w-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0F1111]">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function InputField({
  icon: Icon, placeholder, type = "text", value, onChange,
  showToggle, onToggle,
}: {
  icon: any; placeholder: string; type?: string; value: string;
  onChange: (v: string) => void; showToggle?: boolean; onToggle?: () => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF9900] transition-colors">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-10 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/10 transition-all"
        required
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onToggle}
        >
          {type === "password" ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
        </button>
      )}
    </div>
  );
}
// -----------------------------------------------------------------

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>((searchParams.get("mode") as AuthMode) || "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      if (mode === "login") {
        const res = await api.auth.login(email, password);
        login(res.access_token);
        navigate("/");
      } else if (mode === "signup") {
        const res = await api.auth.signup(name, email, password);
        login(res.access_token);
        navigate("/");
      } else if (mode === "forgot") {
        await api.auth.forgotPassword(email);
        setMode("reset");
      } else if (mode === "reset") {
        await api.auth.resetPassword(email, "", password);
        navigate("/auth");
      }
    } catch (err: any) {
      const msg = err.message || "";
      const friendly = msg.includes("fetch") || msg.includes("network")
        ? "Cannot connect to server. Make sure the backend is running on port 8000."
        : msg || "Something went wrong";
      setAuthError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center px-4 py-10">
      <div className="cursor-pointer mb-6" onClick={() => navigate("/")}>
        <span className="text-2xl font-black text-[#131921]">ShopNest<span className="text-[#FF9900]">.com</span></span>
      </div>

      <AnimatePresence mode="wait">
        {mode === "login" && (
          <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
            <FormCard title="Sign in" subtitle="Welcome back to ShopNest">
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={Mail} placeholder="Email address" value={email} onChange={setEmail} type="email" />
                <InputField
                  icon={Lock} placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={setPassword}
                  showToggle onToggle={() => setShowPassword(!showPassword)}
                />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#FF9900]" />
                    <span className="text-gray-600">Keep me signed in</span>
                  </label>
                  <button type="button" className="text-[#007185] hover:text-[#C7511F] font-medium" onClick={() => setMode("forgot")}>
                    Forgot password?
                  </button>
                </div>
                {authError && <p className="text-xs text-[#CC0C39] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{authError}</p>}
                <button type="submit" disabled={loading} className="w-full h-12 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-[#131921]/30 border-t-[#131921] rounded-full animate-spin" /> : "Sign In"}
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-gray-400">or continue with</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Google", color: "hover:border-red-300", bg: "hover:bg-red-50" },
                  { label: "Apple", color: "hover:border-gray-400", bg: "hover:bg-gray-50" },
                  { label: "Facebook", color: "hover:border-blue-300", bg: "hover:bg-blue-50" },
                ].map(s => (
                  <button key={s.label} className={`py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-all ${s.color} ${s.bg}`}>
                    {s.label}
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-5">
                New to ShopNest?{" "}
                <button className="text-[#007185] hover:text-[#C7511F] font-semibold" onClick={() => setMode("signup")}>
                  Create account
                </button>
              </p>
            </FormCard>
          </motion.div>
        )}

        {mode === "signup" && (
          <motion.div key="signup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
            <FormCard title="Create Account" subtitle="Join millions of shoppers on ShopNest">
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={User} placeholder="Full name" value={name} onChange={setName} />
                <InputField icon={Mail} placeholder="Email address" value={email} onChange={setEmail} type="email" />
                <InputField
                  icon={Lock} placeholder="Password (min. 8 characters)"
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={setPassword}
                  showToggle onToggle={() => setShowPassword(!showPassword)}
                />
                <InputField
                  icon={Lock} placeholder="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword} onChange={setConfirmPassword}
                  showToggle onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                {password && (
                  <div className="space-y-1.5">
                    {[
                      { label: "At least 8 characters", met: password.length >= 8 },
                      { label: "Contains a number", met: /\d/.test(password) },
                      { label: "Contains uppercase", met: /[A-Z]/.test(password) },
                    ].map(req => (
                      <div key={req.label} className={`flex items-center gap-2 text-xs ${req.met ? "text-[#067D62]" : "text-gray-400"}`}>
                        <Check className={`w-3.5 h-3.5 ${req.met ? "opacity-100" : "opacity-30"}`} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#FF9900] mt-0.5" required />
                  <span className="text-xs text-gray-500">
                    I agree to ShopNest's{" "}
                    <span className="text-[#007185] hover:text-[#C7511F]">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-[#007185] hover:text-[#C7511F]">Privacy Policy</span>
                  </span>
                </label>

                {authError && <p className="text-xs text-[#CC0C39] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{authError}</p>}
                <button type="submit" disabled={loading} className="w-full h-12 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center">
                  {loading ? <div className="w-5 h-5 border-2 border-[#131921]/30 border-t-[#131921] rounded-full animate-spin" /> : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <button className="text-[#007185] hover:text-[#C7511F] font-semibold" onClick={() => setMode("login")}>Sign in</button>
              </p>
            </FormCard>
          </motion.div>
        )}

        {mode === "forgot" && (
          <motion.div key="forgot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
            <FormCard title="Forgot Password" subtitle="Enter your email to receive a reset code">
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={Mail} placeholder="Your email address" value={email} onChange={setEmail} type="email" />
                <button type="submit" disabled={loading} className="w-full h-12 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center">
                  {loading ? <div className="w-5 h-5 border-2 border-[#131921]/30 border-t-[#131921] rounded-full animate-spin" /> : "Send Reset Code"}
                </button>
              </form>
              <button className="flex items-center gap-1.5 text-[#007185] hover:text-[#C7511F] text-sm font-medium mt-4 transition-colors" onClick={() => setMode("login")}>
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
            </FormCard>
          </motion.div>
        )}

        {mode === "reset" && (
          <motion.div key="reset" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
            <FormCard title="Reset Password" subtitle="Choose a new secure password">
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  icon={Lock} placeholder="New password"
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={setPassword}
                  showToggle onToggle={() => setShowPassword(!showPassword)}
                />
                <InputField
                  icon={Lock} placeholder="Confirm new password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword} onChange={setConfirmPassword}
                  showToggle onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                <button type="submit" disabled={loading} className="w-full h-12 bg-[#FF9900] hover:bg-[#E88B00] text-[#131921] font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center">
                  {loading ? <div className="w-5 h-5 border-2 border-[#131921]/30 border-t-[#131921] rounded-full animate-spin" /> : "Reset Password"}
                </button>
              </form>
            </FormCard>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
        By continuing, you agree to ShopNest's Conditions of Use and Privacy Notice.
      </p>
    </div>
  );
}
