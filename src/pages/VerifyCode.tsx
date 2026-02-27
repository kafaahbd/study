import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const VerifyCode = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (!stateEmail) {
      navigate('/signup');
      return;
    }
    setEmail(stateEmail);
  }, [location, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // শুধু নম্বর এলাউড

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // অটো-ফোকাস পরবর্তী ইনপুটে
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError(t('verify.enterSixDigitCode') || (lang === 'bn' ? '৬ ডিজিটের কোডটি দিন' : 'Enter 6 digit code'));
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-code`, {
        email,
        code: fullCode,
      });
      navigate('/login', { state: { message: lang === 'bn' ? 'ভেরিফিকেশন সফল! লগইন করুন।' : 'Verification success! Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || t('verify.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-code`, { email });
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || t('verify.resendFailed'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-gray-950 transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-800">
              <i className="fas fa-shield-alt text-2xl text-green-600 dark:text-green-400"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('verify.title') || (lang === 'bn' ? 'কোড যাচাই করুন' : 'Verify Account')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2">
              {t('verify.subtitle') || (lang === 'bn' ? 'আমরা একটি কোড পাঠিয়েছি:' : 'We sent a code to:')} <br/>
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
                  className="w-full h-14 md:h-16 text-center text-2xl font-black bg-slate-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl focus:border-green-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 dark:text-white transition-all outline-none"
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
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 dark:from-blue-700 dark:to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-500/20 dark:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  {t('verify.verifyButton') || 'Verify Now'}
                  <i className="fas fa-check-double text-[10px]"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-50 dark:border-gray-800 pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">
              {t('verify.didNotReceive') || (lang === 'bn' ? 'কোড পাননি?' : "Didn't receive the code?")}
            </p>
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-green-600 dark:text-blue-400 font-black uppercase text-xs tracking-widest hover:underline underline-offset-8 disabled:opacity-50 transition-all"
            >
              {resendLoading ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-circle-notch animate-spin"></i>
                  {t('verify.sending')}
                </span>
              ) : (
                t('verify.resendButton') || (lang === 'bn' ? 'আবার পাঠান' : 'Resend Code')
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default VerifyCode;