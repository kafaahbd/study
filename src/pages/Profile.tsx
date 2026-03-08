import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserExamHistory } from "../services/examService";
import { forumService } from "../services/forumService";
import SEO from "../components/SEO";
import { getProfileColor, getTimeAgo } from "../typescriptfile/utils";
import { 
     Phone, GraduationCap, Layers, Calendar, 
    History, LayoutDashboard, LogOut, Edit3, 
    ShieldAlert, MessageSquare, Heart, Share2, Loader2
} from "lucide-react";

const Profile = () => {
	const { user: currentUser, isLoading, confirmLogout, updateUser } = useAuth();
	const { t, lang } = useLanguage();
    const { userId } = useParams();
    const navigate = useNavigate();
    const isOwnProfile = !userId || userId === currentUser?.id;

    const [profileUser, setProfileUser] = useState<any>(null);
	const [stats, setStats] = useState<any[]>([]);
	const [userPosts, setUserPosts] = useState<any[]>([]);
	const [isStatsLoading, setIsStatsLoading] = useState(true);
	const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(!isOwnProfile);

	const [isEditing, setIsEditing] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

	// formData তে exam_year যুক্ত করা হয়েছে
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		study_level: "SSC" as "SSC" | "HSC",
		group: "Science" as "Science" | "Arts" | "Commerce",
		exam_year: "",
	});

	useEffect(() => {
        const fetchProfileData = async () => {
            if (isOwnProfile) {
                if (currentUser) {
                    setProfileUser(currentUser);
                    setIsProfileLoading(false);
                }
            } else if (userId) {
                setIsProfileLoading(true);
                try {
                    const data = await forumService.getUserProfile(userId);
                    if (data) {
                        setProfileUser(data);
                    } else {
                        setProfileUser(null);
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err);
                    setProfileUser(null);
                } finally {
                    setIsProfileLoading(false);
                }
            }
        };

		const fetchStats = async () => {
            if (!isOwnProfile) {
                setIsStatsLoading(false);
                return;
            }
			try {
				const data = await getUserExamHistory();
				setStats(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Error fetching stats:", err);
			} finally {
				setIsStatsLoading(false);
			}
		};

        const fetchUserPosts = async () => {
            const targetId = userId || currentUser?.id;
            if (!targetId) return;
            setIsPostsLoading(true);
            try {
                const data = await forumService.getUserPosts(targetId);
                setUserPosts(data);
            } catch (err) {
                console.error("Error fetching user posts:", err);
            } finally {
                setIsPostsLoading(false);
            }
        };

        fetchProfileData();
        fetchStats();
        fetchUserPosts();

		if (currentUser && isOwnProfile) {
			setFormData({
				name: currentUser.name,
				phone: currentUser.phone || "",
				study_level: currentUser.study_level,
				group: currentUser.group,
				exam_year: currentUser.exam_year || "",
			});
		}
	}, [userId, currentUser, isOwnProfile]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdating(true);
		try {
			await updateUser(formData);
			setIsEditing(false);
            setToast({ msg: lang === "bn" ? "প্রোফাইল আপডেট হয়েছে" : "Profile updated", type: "success" });
		} catch {
			setToast({ msg: "Update failed!", type: "error" });
		} finally {
			setIsUpdating(false);
		}
	};

    const handleBlock = async () => {
        if (!userId) return;
        try {
            await forumService.blockUser(userId);
            setToast({ msg: lang === "bn" ? "ইউজার ব্লক করা হয়েছে" : "User blocked", type: "success" });
            setTimeout(() => navigate("/forum"), 1500);
        } catch {
            setToast({ msg: "Failed to block", type: "error" });
        }
    };

    const handleToggleReact = async (postId: string) => {
        if (!currentUser) return;
        setUserPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const is_reacted = !p.is_reacted;
                const react_count = is_reacted ? (Number(p.react_count) + 1) : (Number(p.react_count) - 1);
                return { ...p, is_reacted, react_count };
            }
            return p;
        }));
        try {
            await forumService.toggleReact(postId);
        } catch {
            // Rollback
            const targetId = userId || currentUser?.id;
            if (targetId) {
                const data = await forumService.getUserPosts(targetId);
                setUserPosts(data);
            }
        }
    };

	if (isLoading || isProfileLoading) {
		return (
			<div className="flex justify-center items-center min-h-[80vh] bg-slate-50 dark:bg-gray-900">
				<Loader2 className="animate-spin h-10 w-10 text-blue-600" />
			</div>
		);
	}

	if (!currentUser && isOwnProfile) return <Navigate to="/login" replace />;
    
    if (!profileUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-900 p-4">
                <ShieldAlert size={60} className="text-red-500 mb-4 opacity-20" />
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                    {lang === "bn" ? "ইউজার পাওয়া যায়নি" : "User Not Found"}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    {lang === "bn" ? "এই প্রোফাইলটি বর্তমানে উপলব্ধ নেই।" : "This profile is currently unavailable."}
                </p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">
                    {lang === "bn" ? "ফিরে যান" : "Go Back"}
                </button>
            </div>
        );
    }

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

	const getGroupName = (group: string) => {
		const groups: Record<string, string> = {
			Science: lang === "bn" ? "বিজ্ঞান" : "Science",
			Arts: lang === "bn" ? "মানবিক" : "Arts",
			Commerce: lang === "bn" ? "বাণিজ্য" : "Commerce",
		};
		return groups[group] || group;
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-0 pb-10 md:pt-2 md:pb-4 px-3 md:px-4 transition-colors font-sans">
			<SEO 
				title={`${profileUser.name} - Kafa'ah`} 
				description={lang === "bn" ? "প্রোফাইল তথ্য এবং পোস্ট দেখুন।" : "View profile information and posts."}
				image="https://raw.githubusercontent.com/kafaahbd/Eng2/refs/heads/main/studyy.jpg"
				url={`/profile/${profileUser.id}`}
			/>

            {/* Toast UI */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] px-8 py-4 rounded-full shadow-2xl font-black text-white text-sm ${toast.type === "success" ? "bg-blue-600" : "bg-red-500"}`}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

			<div className="w-full max-w-5xl mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6">
					<div>
						<h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
							{isOwnProfile ? t("profile.title") : profileUser.name}
						</h1>
						{isOwnProfile && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-1 md:mt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm"
                            >
                                <Edit3 size={14} />
                                {lang === "bn" ? "তথ্য পরিবর্তন করুন" : "Edit Information"}
                            </button>
                        )}
					</div>

					<div className="flex gap-2 md:gap-3">
						{isOwnProfile ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard size={14} />
                                    {lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                                </Link>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <LogOut size={14} />
                                    {lang === "bn" ? "লগ আউট" : "Logout"}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleBlock}
                                className="flex-1 md:flex-none px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl md:rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                            >
                                <ShieldAlert size={16} />
                                {lang === "bn" ? "ব্লক করুন" : "Block"}
                            </button>
                        )}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
					{/* Identity Card */}
					<div className="lg:col-span-1">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-7 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden"
						>
							<div className="absolute top-0 left-0 w-full h-16 md:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
							<div className="relative">
								<div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr ${getProfileColor(profileUser.name)} rounded-2xl md:rounded-3xl mx-auto flex items-center justify-center text-white text-2xl md:text-3xl font-black mb-3 border-4 border-white dark:border-gray-700 shadow-lg`}>
									{profileUser.name.charAt(0)}
								</div>
								<h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
									{profileUser.name}
								</h2>
								<p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">
									@{profileUser.username}
								</p>

								<div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 text-left px-1 md:px-2">
									<div className="flex justify-between items-center">
										<span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
											<Phone size={12} /> Phone
										</span>
										<span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
											{profileUser.phone || "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
											<GraduationCap size={12} /> Level
										</span>
										<span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
											{profileUser.study_level}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
											<Layers size={12} /> Group
										</span>
										<span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
											{getGroupName(profileUser.group)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
											<Calendar size={12} /> Exam Year
										</span>
										<span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
											{profileUser.exam_year || "Not Set"}
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Stats & History / Posts */}
					<div className="lg:col-span-2 space-y-6 md:space-y-8">
						{isOwnProfile && (
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                                    <span className="text-xl md:text-2xl font-black block mb-1 text-gray-900 dark:text-white">
                                        {isStatsLoading
                                            ? "..."
                                            : totalExams.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-500">
                                        {lang === "bn" ? "মোট পরীক্ষা" : "Exams Taken"}
                                    </span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                                    <span className="text-xl md:text-2xl font-black block mb-1 text-gray-900 dark:text-white">
                                        {isStatsLoading ? "..." : `${avgScore}%`}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-purple-500">
                                        {lang === "bn" ? "গড় স্কোর" : "Avg Score"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Recent Exams (Only for own profile) */}
						{isOwnProfile && (
                            <motion.div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-3">
                                    <History className="text-blue-600" size={20} />
                                    {lang === "bn" ? "সাম্প্রতিক পরীক্ষা" : "Recent Exams"}
                                </h3>
                                <div className="space-y-3 md:space-y-4">
                                    {isStatsLoading ? (
                                        <p className="text-center py-4 text-gray-400 text-sm">
                                            Loading activity...
                                        </p>
                                    ) : stats.length > 0 ? (
                                        stats.slice(0, 3).map((exam, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl md:rounded-2xl"
                                            >
                                                <div>
                                                    <p className="font-black text-gray-800 dark:text-gray-200 text-sm md:text-base">
                                                        {exam.subject_name}
                                                    </p>
                                                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">
                                                        {getTimeAgo(exam.created_at, lang)} • {exam.time_taken ? (
                                                            lang === 'bn' 
                                                                ? `${Math.floor(exam.time_taken / 60)}মি. ${exam.time_taken % 60}সে.`
                                                                : `${Math.floor(exam.time_taken / 60)}m ${exam.time_taken % 60}s`
                                                        ) : '--'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-blue-600 text-sm md:text-base">
                                                        {exam.correct_answers}/{exam.total_questions}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-gray-400 text-sm">
                                            No exams taken yet.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* User Posts */}
                        <div className="space-y-4">
                            <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3 px-2">
                                <MessageSquare className="text-indigo-600" size={20} />
                                {lang === "bn" ? "পোস্টসমূহ" : "Posts"}
                            </h3>
                            
                            {isPostsLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-gray-400" />
                                </div>
                            ) : userPosts.length > 0 ? (
                                userPosts.map((post) => (
                                    <motion.div 
                                        key={post.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${getProfileColor(profileUser.name)} flex items-center justify-center text-white font-black text-base border-2 border-white dark:border-gray-700 uppercase shadow-sm`}>
                                                    {profileUser.name[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 dark:text-white leading-none text-sm">{profileUser.name}</h4>
                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        <span className="text-[8px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md uppercase">{post.category}</span>
                                                        <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded-md uppercase">{post.batch}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 ml-1">{getTimeAgo(post.created_at, lang)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 font-medium whitespace-pre-wrap">{post.content}</p>
                                        <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-gray-700/30">
                                            <button onClick={() => handleToggleReact(post.id)}
                                                className={`flex items-center gap-2 text-xs font-black transition-all ${post.is_reacted ? "text-red-500" : "text-gray-400"}`}
                                            >
                                                <Heart size={18} fill={post.is_reacted ? "currentColor" : "none"} /> {post.react_count || 0}
                                            </button>
                                            <button onClick={() => navigate(`/post/${post.id}`)}
                                                className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <MessageSquare size={18} /> {post.comment_count || 0}
                                            </button>
                                            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-green-600 transition-colors ml-auto">
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-sm font-bold">
                                    No posts yet.
                                </div>
                            )}
                        </div>
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
								className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative"
							>
								<h2 className="text-xl md:text-2xl font-black mb-6 text-gray-900 dark:text-white">
									{lang === "bn" ? "তথ্য আপডেট করুন" : "Update Profile"}
								</h2>
								<form onSubmit={handleUpdate} className="space-y-4">
									<div>
										<label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
											Full Name
										</label>
										<input
											className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											required
										/>
									</div>
									<div className="grid grid-cols-2 gap-3 md:gap-4">
										<div>
											<label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
												Phone
											</label>
											<input
												className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
											/>
										</div>
										<div>
											<label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
												Exam Year
											</label>
											<input
												type="text"
												maxLength={4}
												placeholder="2025"
												className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
												value={formData.exam_year}
												onChange={(e) => {
													const value = e.target.value.replace(/\D/g, "");
													setFormData({ ...formData, exam_year: value });
												}}
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-3 md:gap-4">
										<div>
											<label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
												Level
											</label>
											<select
												className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
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
											<label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-2">
												Group
											</label>
											<select
												className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl outline-none dark:text-white font-bold text-sm md:text-base"
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

									<div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
										<button
											type="button"
											onClick={() => setIsEditing(false)}
											className="flex-1 py-3 md:py-4 font-black text-gray-500 uppercase text-[10px] md:text-xs tracking-widest"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={isUpdating}
											className="flex-1 py-3 md:py-4 font-black bg-blue-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 uppercase text-[10px] md:text-xs tracking-widest disabled:opacity-50"
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
