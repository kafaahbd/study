import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserExamHistory } from "../services/examService";

const Profile = () => {
	const { user, isLoading, confirmLogout, updateUser } = useAuth();
	const { t, lang } = useLanguage();

	const [stats, setStats] = useState<any[]>([]);
	const [isStatsLoading, setIsStatsLoading] = useState(true);

	const [isEditing, setIsEditing] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	// formData তে exam_year যুক্ত করা হয়েছে
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		study_level: "SSC" as "SSC" | "HSC",
		group: "Science" as "Science" | "Arts" | "Commerce",
		exam_year: "",
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await getUserExamHistory();
				setStats(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Error fetching stats:", err);
			} finally {
				setIsStatsLoading(false);
			}
		};

		if (user) {
			fetchStats();
			// ইউজারের ডাটা দিয়ে ফরম ফিল করা (exam_year সহ)
			setFormData({
				name: user.name,
				phone: user.phone || "",
				study_level: user.study_level,
				group: user.group,
				exam_year: user.exam_year || "",
			});
		}
	}, [user]);

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdating(true);
		try {
			await updateUser(formData);
			setIsEditing(false);
		} catch (err) {
			alert("Update failed! Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
			</div>
		);
	}

	if (!user) return <Navigate to="/login" replace />;

	const totalExams = stats.length;
	const avgScore =
		totalExams > 0
			? Math.round(
					stats.reduce(
						(acc, curr) =>
							acc +
							(Number(curr.correct_answers) / Number(curr.total_questions)) *
								100,
						0,
					) / totalExams,
				)
			: 0;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(
			lang === "bn" ? "bn-BD" : "en-US",
			{
				year: "numeric",
				month: "long",
				day: "numeric",
			},
		);
	};

	const getGroupName = (group: string) => {
		const groups: Record<string, string> = {
			Science: lang === "bn" ? "বিজ্ঞান" : "Science",
			Arts: lang === "bn" ? "মানবিক" : "Arts",
			Commerce: lang === "bn" ? "বাণিজ্য" : "Commerce",
		};
		return groups[group] || group;
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 transition-colors font-sans">
			<div className="w-[95%] lg:w-[75%] mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
					<div>
						<h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
							{t("profile.title")}
						</h1>
						<button
							onClick={() => setIsEditing(true)}
							className="mt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
						>
							<i className="fas fa-user-edit text-sm"></i>
							{lang === "bn" ? "তথ্য পরিবর্তন করুন" : "Edit Information"}
						</button>
					</div>

					<button
						onClick={confirmLogout}
						className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
					>
						{lang === "bn" ? "লগ আউট" : "Logout"}
					</button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Identity Card */}
					<div className="lg:col-span-1">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden"
						>
							<div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-500 to-emerald-600 opacity-10"></div>
							<div className="relative">
								<div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-blue-500 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-4 border-4 border-white dark:border-gray-700 shadow-lg">
									{user.name.charAt(0)}
								</div>
								<h2 className="text-2xl font-black text-gray-900 dark:text-white">
									{user.name}
								</h2>
								<p className="text-green-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest">
									@{user.username}
								</p>

								<div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 text-left px-2">
									<div className="flex justify-between items-center">
										<span className="text-[10px] font-black text-gray-400 uppercase">
											Phone
										</span>
										<span className="font-bold text-gray-700 dark:text-gray-300">
											{user.phone || "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-[10px] font-black text-gray-400 uppercase">
											Level
										</span>
										<span className="font-bold text-gray-700 dark:text-gray-300">
											{user.study_level}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-[10px] font-black text-gray-400 uppercase">
											Group
										</span>
										<span className="font-bold text-gray-700 dark:text-gray-300">
											{getGroupName(user.group)}
										</span>
									</div>
									{/* প্রোফাইল কার্ডে Exam Year দেখানো হচ্ছে */}
									<div className="flex justify-between items-center">
										<span className="text-[10px] font-black text-gray-400 uppercase">
											Exam Year
										</span>
										<span className="font-bold text-green-600 dark:text-green-400">
											{user.exam_year || "Not Set"}
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Stats & History */}
					<div className="lg:col-span-2 space-y-8">
						<div className="grid grid-cols-2 md:grid-cols-2 gap-6">
							<div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
								<span className="text-2xl font-black block mb-1 text-gray-900 dark:text-white">
									{isStatsLoading
										? "..."
										: totalExams.toString().padStart(2, "0")}
								</span>
								<span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
									{lang === "bn" ? "মোট পরীক্ষা" : "Exams Taken"}
								</span>
							</div>
							<div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
								<span className="text-2xl font-black block mb-1 text-gray-900 dark:text-white">
									{isStatsLoading ? "..." : `${avgScore}%`}
								</span>
								<span className="text-[10px] font-black uppercase tracking-widest text-purple-500">
									{lang === "bn" ? "গড় স্কোর" : "Avg Score"}
								</span>
							</div>
						</div>

						<motion.div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
							<h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
								<i className="fas fa-history text-green-600"></i>
								{lang === "bn" ? "সাম্প্রতিক পরীক্ষা" : "Recent Exams"}
							</h3>
							<div className="space-y-4">
								{isStatsLoading ? (
									<p className="text-center py-4 text-gray-400">
										Loading activity...
									</p>
								) : stats.length > 0 ? (
									stats.slice(0, 5).map((exam, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl"
										>
											<div>
												<p className="font-black text-gray-800 dark:text-gray-200">
													{exam.subject_name}
												</p>
												<p className="text-[10px] text-gray-400 font-bold uppercase">
													{formatDate(exam.created_at)}
												</p>
											</div>
											<div className="text-right">
												<p className="font-black text-green-600">
													{exam.correct_answers}/{exam.total_questions}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-10 text-gray-400">
										No exams taken yet.
									</div>
								)}
							</div>
						</motion.div>
					</div>
				</div>

				{/* Edit Profile Modal */}
				<AnimatePresence>
					{isEditing && (
						<div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative"
							>
								<h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">
									{lang === "bn" ? "তথ্য আপডেট করুন" : "Update Profile"}
								</h2>
								<form onSubmit={handleUpdate} className="space-y-4">
									<div>
										<label className="text-[10px] font-black text-gray-400 uppercase ml-2">
											Full Name
										</label>
										<input
											className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none dark:text-white font-bold"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											required
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-[10px] font-black text-gray-400 uppercase ml-2">
												Phone
											</label>
											<input
												className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none dark:text-white font-bold"
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
											/>
										</div>
										{/* Exam Year ইনপুট ফিল্ড */}
										<div>
											<label className="text-[10px] font-black text-gray-400 uppercase ml-2">
												Exam Year
											</label>
											<input
												type="text"
												maxLength={4} // ৪ সংখ্যার বেশি লেখা যাবে না
												placeholder="2025"
												className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none dark:text-white font-bold"
												value={formData.exam_year}
												onChange={(e) => {
													// শুধু সংখ্যা ইনপুট নেওয়ার জন্য ছোট একটি চেক
													const value = e.target.value.replace(/\D/g, "");
													setFormData({ ...formData, exam_year: value });
												}}
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-[10px] font-black text-gray-400 uppercase ml-2">
												Level
											</label>
											<select
												className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none dark:text-white font-bold"
												value={formData.study_level}
												onChange={(e) =>
													setFormData({
														...formData,
														study_level: e.target.value as any,
													})
												}
											>
												<option value="SSC">SSC</option>
												<option value="HSC">HSC</option>
											</select>
										</div>
										<div>
											<label className="text-[10px] font-black text-gray-400 uppercase ml-2">
												Group
											</label>
											<select
												className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none dark:text-white font-bold"
												value={formData.group}
												onChange={(e) =>
													setFormData({
														...formData,
														group: e.target.value as any,
													})
												}
											>
												<option value="Science">Science</option>
												<option value="Arts">Arts</option>
												<option value="Commerce">Commerce</option>
											</select>
										</div>
									</div>

									<div className="flex gap-4 mt-8">
										<button
											type="button"
											onClick={() => setIsEditing(false)}
											className="flex-1 py-4 font-black text-gray-500 uppercase text-xs tracking-widest"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={isUpdating}
											className="flex-1 py-4 font-black bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 uppercase text-xs tracking-widest disabled:opacity-50"
										>
											{isUpdating ? "Saving..." : "Save Changes"}
										</button>
									</div>
								</form>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Profile;
