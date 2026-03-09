import { useMemo, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    const pass = password;
    let score = 0;
    const suggestions = [];

    if (pass.length >= 8) score++;
    else suggestions.push(lang === 'bn' ? "কমপক্ষে ৮টি অক্ষর" : "At least 8 characters");

    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    else suggestions.push(lang === 'bn' ? "বড় ও ছোট হাতের অক্ষর" : "Upper & lower case letters");

    if (/[0-9]/.test(pass)) score++;
    else suggestions.push(lang === 'bn' ? "অন্তত একটি সংখ্যা" : "At least one number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    else suggestions.push(lang === 'bn' ? "একটি বিশেষ চিহ্ন (!@#$)" : "One special character (!@#$)");

    let label = "";
    let color = "";
    switch (score) {
      case 0:
      case 1:
        label = lang === 'bn' ? "খুব দুর্বল" : "Very Weak";
        color = "bg-red-500";
        break;
      case 2:
        label = lang === 'bn' ? "দুর্বল" : "Weak";
        color = "bg-orange-500";
        break;
      case 3:
        label = lang === 'bn' ? "মাঝারি" : "Medium";
        color = "bg-yellow-500";
        break;
      case 4:
        label = lang === 'bn' ? "শক্তিশালী" : "Strong";
        color = "bg-green-500";
        break;
    }

    return { score, label, color, suggestions };
  }, [password, lang]);

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    
    retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    retVal += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    retVal += "0123456789"[Math.floor(Math.random() * 10)];
    retVal += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    for (let i = 4; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    retVal = retVal.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(retVal);
    setConfirmPassword(retVal);
    setShowPassword(true);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert(lang === 'bn' ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match");
        return;
    }

    if (passwordStrength.score < 4) {
      alert(lang === 'bn' 
        ? "পাসওয়ার্ড অবশ্যই ৮ অক্ষরের হতে হবে এবং এতে অক্ষর, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে।" 
        : "Password must be at least 8 characters and include letters, numbers, and special characters.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        email, code, newPassword: password
      });
      alert(lang === 'bn' ? "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে" : "Password reset successful");
      navigate("/login");
    } catch {
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
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 block">
                {lang === 'bn' ? "পাসওয়ার্ড" : "Password"}
              </label>
              <button 
                type="button"
                onClick={generateStrongPassword}
                className="text-[9px] font-black uppercase tracking-widest text-green-600 dark:text-blue-400 hover:underline"
              >
                {lang === 'bn' ? "শক্তিশালী পাসওয়ার্ড দিন" : "Suggest Strong Password"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {password && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-gray-400">{lang === 'bn' ? "পাসওয়ার্ডের শক্তি" : "Password Strength"}:</span>
                  <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`h-full flex-1 transition-all duration-500 ${
                        step <= passwordStrength.score ? passwordStrength.color : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {passwordStrength.suggestions.map((s, i) => (
                      <span key={i} className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                        + {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors px-2 py-1"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
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