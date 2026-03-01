import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const VerifyCode = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  // এটি পাসওয়ার্ড রিসেট কি না তা চেক করার জন্য
  const isPasswordReset = location.state?.isPasswordReset || false;

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (!stateEmail) {
      // ইমেইল না থাকলে সাইনআপ পেজে ফেরত পাঠানো
      navigate('/signup');
      return;
    }
    setEmail(stateEmail);
  }, [location, navigate]);

  // ইনপুট পরিবর্তন হ্যান্ডল করা
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // শুধু সংখ্যা গ্রহণ করবে

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // অটো-ফোকাস পরবর্তী ইনপুটে
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // ব্যাকস্পেস হ্যান্ডল করা
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // কোড সাবমিট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError(lang === 'bn' ? '৬ ডিজিটের কোডটি দিন' : 'Enter 6 digit code');
      return;
    }

    setIsLoading(true);
    try {
      // এন্ডপয়েন্ট নির্ধারণ (পাসওয়ার্ড রিসেট না কি অ্যাকাউন্ট ভেরিফিকেশন)
      const endpoint = isPasswordReset ? '/auth/verify-reset-code' : '/auth/verify-code';
      
      await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        email,
        code: fullCode,
      });

      if (isPasswordReset) {
        // পাসওয়ার্ড রিসেট হলে নতুন পাসওয়ার্ড সেট করার পেজে যাবে
        navigate('/reset-password', { state: { email, code: fullCode } });
      } else {
        // নতুন অ্যাকাউন্ট হলে লগইন পেজে যাবে
        navigate('/login', { 
          state: { message: lang === 'bn' ? 'ভেরিফিকেশন সফল! লগইন করুন।' : 'Verification success! Please login.' } 
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? 'কোডটি সঠিক নয়' : 'Invalid code'));
    } finally {
      setIsLoading(false);
    }
  };

  // কোড পুনরায় পাঠানো
  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-code`, { email });
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
      alert(lang === 'bn' ? 'নতুন কোড পাঠানো হয়েছে' : 'New code sent successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'bn' ? 'কোড পাঠাতে ব্যর্থ' : 'Failed to resend code'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-gray-900 transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${isPasswordReset ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100' : 'bg-green-50 dark:bg-green-900/20 border-green-100'}`}>
              <i className={`fas ${isPasswordReset ? 'fa-key text-orange-600' : 'fa-shield-alt text-green-600'} text-2xl`}></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {isPasswordReset ? (lang === 'bn' ? 'কোডটি দিন' : 'Enter Code') : (t('verify.title') || 'Verify Account')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2">
              {lang === 'bn' ? 'আমরা এই ইমেইলে একটি কোড পাঠিয়েছি:' : 'We sent a code to:'} <br/>
              <span className="text-gray-900 dark:text-gray-200 font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 md:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-full h-14 md:h-16 text-center text-2xl font-black bg-slate-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-700 dark:text-white transition-all outline-none ${isPasswordReset ? 'focus:border-orange-500' : 'focus:border-green-500'}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl"
              >
                <p className="text-red-700 dark:text-red-400 text-xs font-bold flex items-center">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 ${isPasswordReset ? 'bg-gradient-to-r from-orange-600 to-red-500 shadow-orange-500/20' : 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-500/20'}`}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  {isPasswordReset ? (lang === 'bn' ? 'কোড যাচাই করুন' : 'Verify Code') : (t('verify.verifyButton') || 'Verify Now')}
                  <i className="fas fa-check-double text-[10px]"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-50 dark:border-gray-800 pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">
              {lang === 'bn' ? 'কোড পাননি?' : "Didn't receive the code?"}
            </p>
            <button
              onClick={handleResend}
              type="button"
              disabled={resendLoading}
              className={`${isPasswordReset ? 'text-orange-600' : 'text-green-600'} dark:text-blue-400 font-black uppercase text-xs tracking-widest hover:underline underline-offset-8 disabled:opacity-50 transition-all`}
            >
              {resendLoading ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-circle-notch animate-spin"></i>
                  {lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}
                </span>
              ) : (
                lang === 'bn' ? 'আবার পাঠান' : 'Resend Code'
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default VerifyCode;