import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const { t, lang } = useLanguage();
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

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
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(err.response?.data?.email || identifier);
        setError(t("modal.pleaseVerifyEmail"));
      } else {
        setError(err.message);
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
      setResendSuccess(t("modal.verificationEmailResent"));
    } catch (err: any) {
      setError(err.response?.data?.message || t("modal.resendFailed"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo/Brand Section */}
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
            {lang === 'bn' ? 'স্বাগতম! আপনার জ্ঞানযাত্রা শুরু হোক।' : 'Welcome back! Let your journey continue.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 md:p-10 relative overflow-hidden">
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>

          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3 text-green-700 dark:text-green-400 text-sm font-bold">
              <i className="fas fa-check-circle text-lg"></i>
              {resendSuccess}
            </div>
          )}

          {needsVerification ? (
            <div className="space-y-6">
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
                <i className="fas fa-envelope-open-text text-amber-500 text-3xl mb-3"></i>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  {t("modal.verificationRequired")}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full h-12 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50"
                >
                  {resendLoading ? <i className="fas fa-spinner fa-spin"></i> : t("modal.resendVerification")}
                </button>
                <button
                  onClick={() => navigate("/verify-code", { state: { email: unverifiedEmail } })}
                  className="w-full h-12 bg-white dark:bg-transparent border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
                  {t("modal.enterCode") || "Enter Code"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Group */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                    {t("modal.emailOrUsername")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium"
                      placeholder={t("modal.emailOrUsernamePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                    {t("modal.password")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl"
                >
                  <i className="fas fa-circle-exclamation mr-2"></i>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 dark:from-blue-700 dark:to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-500/20 dark:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin text-xl"></i>
                ) : (
                  t("modal.login")
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t("modal.noAccount")}{" "}
              <Link
                to="/signup"
                className="text-green-600 dark:text-blue-400 font-black hover:underline underline-offset-4"
              >
                {t("modal.createAccount")}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
           <Link to="/" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition">
             <i className="fas fa-house mr-2"></i> Back to Home
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;