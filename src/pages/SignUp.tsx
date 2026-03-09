import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

const SignUp = () => {
  const { t, lang } = useLanguage();
  const { register, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    hide_phone: false,
    study_level: "SSC" as "SSC" | "HSC",
    group: "Science" as "Science" | "Arts" | "Commerce",
    exam_year: "", 
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
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
  }, [formData.password, lang]);

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    
    // Ensure at least one of each required type
    retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    retVal += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    retVal += "0123456789"[Math.floor(Math.random() * 10)];
    retVal += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    for (let i = 4; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    retVal = retVal.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFormData({ ...formData, password: retVal, confirmPassword: retVal });
    setShowPassword(true);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // শুধুমাত্র সংখ্যা ইনপুট নেওয়ার জন্য ফিল্টার (ফোন এবং বছরের জন্য)
    if (name === "exam_year" || name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("modal.passwordsDoNotMatch"));
      return;
    }

    if (passwordStrength.score < 4) {
      setError(lang === 'bn' 
        ? "পাসওয়ার্ড অবশ্যই ৮ অক্ষরের হতে হবে এবং এতে অক্ষর, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে।" 
        : "Password must be at least 8 characters and include letters, numbers, and special characters.");
      return;
    }

    try {
      const { ...registerData } = formData;
      await register(registerData);
      navigate("/verify-code", { state: { email: formData.email } });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col items-center justify-start lg:justify-center px-3 lg:px-4 pt-4 lg:pt-10 pb-10 transition-colors font-sans">
      <SEO 
        title={lang === "bn" ? "সাইন আপ - কাফআহ" : "Sign Up - Kafa'ah"} 
        image="https://study.kafaahbd.com/stufy.jpg"
        url="/signup"
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full"
      >
        {/* Form Section */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-5 lg:p-12 relative overflow-hidden">
            {/* Decorative Top Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>

            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t("modal.signUp")}
              </h2>
            </div>

            {error && (
              <motion.div 
                initial={{ x: -20 }} animate={{ x: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl"
              >
                <i className="fas fa-exclamation-triangle mr-2"></i> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 border-b border-gray-100 dark:border-gray-800 pb-1">
                    {lang === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}
                  </h3>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                      {t("modal.username")}
                    </label>
                    <input
                      type="text" name="username" value={formData.username} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                      placeholder="johndoe123"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                      {t("modal.fullName")}
                    </label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                      {t("modal.email")}
                    </label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                      {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="text" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                      placeholder="017XXXXXXXX"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" name="hide_phone" checked={formData.hide_phone} onChange={(e) => setFormData({...formData, hide_phone: e.target.checked})} className="rounded text-green-600" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{lang === 'bn' ? 'ফোন নম্বর গোপন রাখুন' : 'Hide phone number'}</span>
                    </label>
                  </div>
                </div>

                {/* Academic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 border-b border-gray-100 dark:border-gray-800 pb-1">
                    {lang === 'bn' ? 'শিক্ষাগত তথ্য' : 'Academic Details'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                        {t("modal.studyLevel")}
                      </label>
                      <select
                        name="study_level" value={formData.study_level} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-bold text-sm appearance-none"
                      >
                        <option value="SSC">SSC</option>
                        <option value="HSC">HSC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                        {t("modal.group")}
                      </label>
                      <select
                        name="group" value={formData.group} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-bold text-sm appearance-none"
                      >
                        <option value="Science">{t("modal.science")}</option>
                        <option value="Arts">{t("modal.arts")}</option>
                        <option value="Commerce">{t("modal.commerce")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                      {lang === 'bn' ? 'পরীক্ষার বছর' : 'Exam Year'}
                    </label>
                    <input
                      type="text" name="exam_year" value={formData.exam_year} onChange={handleChange}
                      maxLength={4} placeholder="2025"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                    />
                  </div>

                  {/* Password Section */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 block">
                          {t("modal.password")}
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
                        name="password" value={formData.password} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                        placeholder="••••••••"
                      />
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
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
                        className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors px-2 py-1"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                        {t("modal.confirmPassword")}
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-green-500/20 rounded-xl dark:text-white transition-all outline-none font-medium text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-blue-700 dark:to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-500/20 dark:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      {t("modal.signUp")}
                      <i className="fas fa-arrow-right text-xs"></i>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                {t("modal.alreadyHaveAccount")}{" "}
                <Link to="/login" className="text-green-600 dark:text-blue-400 font-black hover:underline underline-offset-4">
                  {t("modal.login")}
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
             <Link
               to="/"
               className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-green-500 dark:hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
             >
               <i className="fas fa-arrow-left"></i> {lang === 'bn' ? "হোমে ফিরে যান" : "Back to Home"}
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;