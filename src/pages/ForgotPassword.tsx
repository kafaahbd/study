import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ব্যাকএন্ডে এই এপিআই থাকতে হবে
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      
      // ভেরিফিকেশন পেজে পাঠানো হচ্ছে এবং flag দেওয়া হচ্ছে যে এটা পাসওয়ার্ড রিসেট
      navigate("/verify-code", { state: { email, isPasswordReset: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? 'ইমেইলটি সঠিক নয় বা পাওয়া যায়নি' : 'Invalid email or not found'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/">
            <img src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" alt="Kafa'ah" className="h-16 mx-auto mb-4" />
          </Link>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Forgot Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">
            {lang === 'bn' ? 'আপনার নিবন্ধিত ইমেইলটি দিন' : 'Enter your registered email'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                {lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/50 dark:text-white outline-none font-medium transition-all"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl">
                <i className="fas fa-circle-exclamation mr-2"></i> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (lang === 'bn' ? 'কোড পাঠান' : 'Send Code')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-800 pt-6">
            <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
              <i className="fas fa-arrow-left mr-2"></i> {lang === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;