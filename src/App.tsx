import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLanguage } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";

// কম্পোনেন্ট ইম্পোর্ট
import VerifyCode from "./pages/VerifyCode";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const Study = lazy(() => import("./pages/Study"));
const SSCCorner = lazy(() => import("./pages/SSCCorner"));
const HSCCorner = lazy(() => import("./pages/HSCCorner"));
const AdmissionCorner = lazy(() => import("./pages/AdmissionCorner"));
const ExamCenter = lazy(() => import("./pages/ExamCenter"));
const Profile = lazy(() => import("./pages/Profile"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

// প্রিমিয়াম পেজ লোডার
const PageLoader = () => {
  const { lang } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-24 w-24 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
        {/* Animated Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute h-24 w-24 rounded-full border-t-4 border-green-500 dark:border-blue-500"
        ></motion.div>
        {/* Logo/Icon in Center */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute"
        >
          <div className="h-4 w-4 bg-green-500 dark:bg-blue-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
        </motion.div>
      </div>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 animate-pulse"
      >
        {lang === "bn" ? "প্রক্রিয়াধীন..." : "Processing..."}
      </motion.p>
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white selection:bg-green-100 dark:selection:bg-blue-900/30">
        <Navbar />
        
        <main className="flex-grow relative">
          {/* Suspense handles Lazy Loading */}
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Study />} />
                  <Route path="/ssc" element={<SSCCorner />} />
                  <Route path="/hsc" element={<HSCCorner />} />
                  <Route path="/admission" element={<AdmissionCorner />} />
                  <Route path="/exam" element={<ExamCenter />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/verify-code" element={<VerifyCode />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;