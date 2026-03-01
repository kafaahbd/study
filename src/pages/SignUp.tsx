import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const SignUp = () => {
  const { t, lang } = useLanguage();
  const { register, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "", // ফোন নম্বর এখানে স্টোর হবে
    study_level: "SSC" as "SSC" | "HSC",
    group: "Science" as "Science" | "Arts" | "Commerce",
    exam_year: "", 
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

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

    if (formData.password.length < 6) {
      setError(t("modal.passwordTooShort"));
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate("/verify-code", { state: { email: formData.email } });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center px-4 py-16 transition-colors font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 hover:scale-105 transition-transform">
            <img 
              src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" 
              alt="Kafa'ah" 
              className="h-14 mx-auto"
            />
          </Link>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t("modal.signUp")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic text-sm">
            {lang === 'bn' ? 'কাফআহ পরিবারের সদস্য হয়ে আপনার যাত্রা শুরু করুন' : 'Join the Kafa\'ah family and start your journey'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 dark:bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          {error && (
            <motion.div 
              initial={{ x: -20 }} animate={{ x: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs font-bold rounded-r-xl"
            >
              <i className="fas fa-exclamation-triangle mr-2"></i> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
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
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
                    placeholder="johndoe123"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                    {t("modal.fullName")}
                  </label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                    {t("modal.email")}
                  </label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
                    placeholder="example@email.com"
                  />
                </div>

                {/* --- ADDED PHONE FIELD --- */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                    {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
                    placeholder="017XXXXXXXX"
                  />
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
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-bold text-sm"
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
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-bold text-sm"
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
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
                  />
                </div>

                {/* Password Section */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                      {t("modal.password")}
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password" value={formData.password} onChange={handleChange} required minLength={6}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
                      placeholder="••••••••"
                    />
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
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500/50 dark:focus:ring-blue-500/50 dark:text-white transition-all outline-none font-medium text-sm"
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
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 dark:from-blue-700 dark:to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-500/20 dark:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
             &copy; 2026 Kafa'ah Platform
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;