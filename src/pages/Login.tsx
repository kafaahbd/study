import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { t, lang } = useLanguage();
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // ভেরিফিকেশন লজিকের জন্য স্টেট
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // ইউজার ইতিমধ্যে লগইন করা থাকলে হোমে পাঠিয়ে দাও
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setResendSuccess("");

    try {
      await login(identifier, password);
      navigate("/");
    } catch (err: any) {
      // যদি ব্যাকএন্ড থেকে ভেরিফিকেশন প্রয়োজন এমন মেসেজ আসে (status 403)
      if (err.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(err.email || identifier);
        setError(lang === 'bn' ? "আপনার অ্যাকাউন্টটি ভেরিফাই করা নেই।" : "Your account is not verified.");
      } else {
        setError(err.message || (lang === 'bn' ? "লগইন ব্যর্থ হয়েছে।" : "Login failed."));
      }
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess("");
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-code`, {
        email: unverifiedEmail,
      });
      setResendSuccess(lang === 'bn' ? "কোড পুনরায় পাঠানো হয়েছে!" : "Verification code resent!");
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? "কোড পাঠাতে ব্যর্থ হয়েছে।" : "Failed to resend code."));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <img
              src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png"
              alt="Kafa'ah"
              className="h-16 mx-auto mb-4"
            />
          </Link>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t("modal.login")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">
            {lang === "bn"
              ? "স্বাগতম! আপনার জ্ঞানযাত্রা শুরু হোক।"
              : "Welcome back! Let your journey continue."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 md:p-10 relative overflow-hidden">
          {/* Decorative bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>

          <AnimatePresence mode="wait">
            {needsVerification ? (
              /* ভেরিফিকেশন কার্ড */
              <motion.div 
                key="verification"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-envelope-open-text text-amber-500 text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
                    {lang === 'bn' 
                      ? `আমরা ${unverifiedEmail} এ একটি কোড পাঠিয়েছি। অ্যাকাউন্ট সক্রিয় করতে কোডটি দিন।`
                      : `We've sent a code to ${unverifiedEmail}. Please verify to continue.`}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/verify-code", { state: { email: unverifiedEmail } })}
                    className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    {lang === 'bn' ? "কোড লিখুন" : "Enter Code"}
                  </button>
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full h-14 bg-transparent border-2 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {resendLoading ? <i className="fas fa-spinner fa-spin"></i> : (lang === 'bn' ? "কোড পুনরায় পাঠান" : "Resend Code")}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* সাধারণ লগইন ফর্ম */
              <motion.form 
                key="login-form"
                onSubmit={handleSubmit} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 ml-1">
                    {t("modal.emailOrUsername")}
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl dark:text-white transition-all outline-none font-medium"
                      placeholder={t("modal.emailOrUsernamePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 ml-1">
                    {t("modal.password")}
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl dark:text-white transition-all outline-none font-medium"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-black uppercase text-gray-400 hover:text-orange-500 tracking-widest transition-colors"
                  >
                    {t("modal.forgotPassword") || "Forgot Password?"}
                  </Link>
                </div>

                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl flex items-center gap-3 overflow-hidden"
                    >
                      <i className="fas fa-circle-exclamation text-base"></i>
                      {error}
                    </motion.div>
                  )}
                  {resendSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 text-xs font-bold rounded-r-xl flex items-center gap-3 overflow-hidden"
                    >
                      <i className="fas fa-check-circle text-base"></i>
                      {resendSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin text-xl"></i>
                  ) : (
                    t("modal.login")
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t("modal.noAccount")}{" "}
              <Link
                to="/signup"
                className="text-blue-600 dark:text-blue-400 font-black hover:underline underline-offset-4"
              >
                {t("modal.createAccount")}
              </Link>
            </p>
          </div>
        </div>

        {/* Home Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> {lang === 'bn' ? "হোমে ফিরে যান" : "Back to Home"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;