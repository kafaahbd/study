import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLanguage } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Suspense, lazy } from "react";

const Study = lazy(() => import("./pages/Study"));
const SSCCorner = lazy(() => import("./pages/SSCCorner"));
const HSCCorner = lazy(() => import("./pages/HSCCorner"));
const AdmissionCorner = lazy(() => import("./pages/AdmissionCorner"));
const ExamCenter = lazy(() => import("./pages/ExamCenter"));
const Profile = lazy(() => import("./pages/Profile"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail")); // ← নতুন ইম্পোর্ট

function App() {
  const { lang } = useLanguage();

  const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-600 dark:border-blue-400"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-4 w-4 bg-green-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400 font-medium">
          {lang === "bn" ? "পৃষ্ঠা লোড হচ্ছে..." : "Loading page..."}
        </p>
      </div>
    </div>
  );

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Study />} />
              <Route path="/ssc" element={<SSCCorner />} />
              <Route path="/hsc" element={<HSCCorner />} />
              <Route path="/admission" element={<AdmissionCorner />} />
              <Route path="/exam" element={<ExamCenter />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify-email" element={<VerifyEmail />} /> {/* ← নতুন রুট */}
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;