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
import ProtectedRoute from './components/ProtectedRoute'

const Study = lazy(() => import("./pages/Study"));
const SSCCorner = lazy(() => import("./pages/SSCCorner"));
const HSCCorner = lazy(() => import("./pages/HSCCorner"));
const AdmissionCorner = lazy(() => import("./pages/AdmissionCorner"));
const ExamCenter = lazy(() => import("./pages/ExamCenter"));
const Profile = lazy(() => import("./pages/Profile"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Forum = lazy(() => import("./pages/Forum"));

// প্রিমিয়াম পেজ লোডার
const PageLoader = () => {
	const { lang } = useLanguage();

	return (
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
									<Route path="/dashboard" element={<Dashboard />} />
									<Route
										path="/forum"
										element={
											<ProtectedRoute>
												<Forum />
											</ProtectedRoute>
										}
									/>
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
