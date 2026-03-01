import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, code } = location.state || {}; // VerifyCode থেকে আসা ডাটা
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert(lang === 'bn' ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match");
        return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        email, code, newPassword: password
      });
      alert(lang === 'bn' ? "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে" : "Password reset successful");
      navigate("/login");
    } catch (err) {
      alert("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-black mb-6 dark:text-white text-center">
          {lang === 'bn' ? "নতুন পাসওয়ার্ড" : "New Password"}
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button 
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            {isLoading ? "Updating..." : (lang === 'bn' ? "পাসওয়ার্ড আপডেট করুন" : "Update Password")}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;