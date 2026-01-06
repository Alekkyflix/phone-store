import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Zap, 
  X, 
  Loader2 
} from "lucide-react";
import { hashPassword } from "../../utils/crypto";
import SmartphoneIcon from "../../components/common/SmartphoneIcon";

/**
 * AuthPage Component
 * Handles staff authentication (Login and Signup).
 * Includes password strength validation and hardcoded administrator bypass.
 */
const AuthPage = ({ mode, n8nConfig, setCurrentUser, setIsAuthenticated, setCurrentView }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "",
  });

  /**
   * Validates password strength and returns a score/message
   */
  const validatePassword = (password) => {
    let score = 0;
    let message = "";
    let color = "";

    if (password.length < 8) {
      return {
        score: 0,
        message: "Password must be at least 8 characters",
        color: "text-red-400",
      };
    }

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
      message = "Weak password";
      color = "text-red-400";
    } else if (score <= 3) {
      message = "Moderate password";
      color = "text-yellow-400";
    } else {
      message = "Strong password";
      color = "text-green-400";
    }

    return { score, message, color };
  };

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });
    if (value) {
      setPasswordStrength(validatePassword(value));
    } else {
      setPasswordStrength({ score: 0, message: "", color: "" });
    }
  };

  /**
   * Handles the submission of login/signup requests
   */
  const handleSubmit = async () => {
    setStatus({ type: "", message: "" });

    // Hardcoded flix login bypass for development/admin access
    if (mode === 'login' && formData.email === 'flix' && formData.password === 'Test1111') {
      const user = { email: 'flix', fullName: 'Flix Administrator', role: 'admin' };
      localStorage.setItem('phone-shop-auth', JSON.stringify({
        isAuthenticated: true,
        user,
        timestamp: new Date().toISOString()
      }));
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentView('app');
      return;
    }

    // Signup validation
    if (mode === "signup") {
      if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
        setStatus({ type: "error", message: "Please fill in all fields" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setStatus({ type: "error", message: "Passwords do not match" });
        return;
      }
      const strength = validatePassword(formData.password);
      if (strength.score < 2) {
        setStatus({
          type: "error",
          message: "Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers",
        });
        return;
      }
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setStatus({ type: "error", message: "Please enter email and password" });
        return;
      }
    }

    if (!n8nConfig.webhookUrl) {
      setStatus({
        type: "error",
        message: "System configuration error. Please contact administrator.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const hashedPassword = await hashPassword(formData.password);

      const authData = {
        action: mode === "signup" ? "signup_request" : "login_request",
        timestamp: new Date().toISOString(),
        user: {
          email: formData.email.toLowerCase().trim(),
          passwordHash: hashedPassword,
          ...(mode === "signup" && {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
          }),
        },
      };

      const response = await fetch(n8nConfig.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
      });

      if (response.ok) {
        const result = await response.json();

        if (mode === "signup") {
          setStatus({
            type: "success",
            message: "✅ Account request submitted! You will receive an email once your account is approved by the administrator.",
          });
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            phoneNumber: "",
          });
        } else {
          if (result.success && result.user) {
            // Store auth session
            localStorage.setItem("phone-shop-auth", JSON.stringify({
              isAuthenticated: true,
              user: result.user,
              timestamp: new Date().toISOString(),
            }));

            setCurrentUser(result.user);
            setIsAuthenticated(true);
            setCurrentView("app");
          } else {
            setStatus({
              type: "error",
              message: result.message || "Invalid credentials or account not approved yet",
            });
          }
        }
      } else {
        setStatus({
          type: "error",
          message: "Authentication failed. Please try again.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", message: `Error: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px]"></div>
      
      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-500">
        <button
          onClick={() => setCurrentView("landing")}
          className="mb-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-colors group"
        >
          <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
            <X size={16} />
          </div>
          Exit to Shop
        </button>

        <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-[3rem] shadow-2xl p-10">
          <div className="text-center mb-10">
            <div className="bg-white/30 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20 shadow-xl">
              <Lock className="text-white" size={40} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Staff Portal
            </h2>
            <p className="text-blue-100/70 mt-3 font-medium text-xs uppercase tracking-widest">
              Authorized access only
            </p>
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-black text-white/80 mb-2 ml-1 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40 font-bold transition-all"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-white/80 mb-2 ml-1 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40 font-bold transition-all"
                    placeholder="+254712345678"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-black text-white/80 mb-2 ml-1 uppercase tracking-widest">
                Staff Identity
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-4 text-white/50 group-hover:text-white/80 transition-colors pointer-events-none"
                  size={20}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40 font-bold transition-all hover:bg-white/15 cursor-text relative z-10"
                  placeholder="Username or Email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-white/80 mb-2 ml-1 uppercase tracking-widest">
                Access Key
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-4 text-white/50 group-hover:text-white/80 transition-colors pointer-events-none"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40 font-bold transition-all hover:bg-white/15 cursor-text relative z-10"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-white/50 hover:text-white z-20 transition-all p-1 hover:bg-white/10 rounded-lg"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {mode === "signup" && passwordStrength.message && (
                <p className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${passwordStrength.color}`}>
                  {passwordStrength.message}
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-black text-white/80 mb-2 ml-1 uppercase tracking-widest">
                  Confirm Key
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-4 text-white/50 group-hover:text-white/80 transition-colors pointer-events-none"
                    size={20}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40 font-bold transition-all hover:bg-white/15"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-white/50 hover:text-white z-20 transition-all p-1 hover:bg-white/10 rounded-lg"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-6 py-5 bg-white text-blue-950 font-black text-xl rounded-2xl shadow-2xl hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Unlock Access <Zap size={20} className="fill-blue-950" />
                </>
              )}
            </button>
          </div>

          {status.message && (
            <div
              className={`mt-4 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 ${
                status.type === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-200"
                  : "bg-red-500/20 border border-red-500/30 text-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="mt-8 text-center text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
            Authorized personnel only • Secure access monitored
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
