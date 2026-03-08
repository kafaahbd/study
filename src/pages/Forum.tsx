import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { forumService } from "../services/forumService";
import SEO from "../components/SEO";
import {
    MessageSquare, Heart, Inbox, Trash2, Send,
    Filter, X, Share2,
    MoreHorizontal, Edit3, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";
import { getProfileColor, getTimeAgo } from "../typescriptfile/utils";

const Forum: React.FC = () => {
    const { user } = useAuth();
    const { lang } = useLanguage(); // 't' রিমুভ করা হয়েছে কারণ এটি ব্যবহৃত হচ্ছিল না
    const navigate = useNavigate();

    // UI States
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // --- Filtering States ---
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [activeBatch, setActiveBatch] = useState<string>("All");

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string | null }>({
        isOpen: false, postId: null,
    });
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // কনস্ট্যান্ট ভ্যালুগুলো
    const categories = ["Common", "Science", "Arts", "Commerce"];
    const filterCategories = ["All", ...categories];
    const batches = ["All", "SSC", "HSC"]
    const filterBatches = ["All", ...batches];

    // পোস্ট ফেচ করার ফাংশন
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await forumService.getPosts(activeCategory, activeBatch);
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [activeCategory, activeBatch]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleToggleReact = async (postId: string) => {
        if (!user) {
            setToast({ msg: lang === "bn" ? "রিঅ্যাক্ট দিতে লগইন করুন" : "Login to react", type: "error" });
            return;
        }
        // Optimistic Update
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const is_reacted = !p.is_reacted;
                const react_count = is_reacted ? (Number(p.react_count) + 1) : (Number(p.react_count) - 1);
                return { ...p, is_reacted, react_count };
            }
            return p;
        }));

        try {
            await forumService.toggleReact(postId);
            // No need to fetchPosts() here as we updated state optimistically
            // and the backend call is already handled.
        } catch (err) { 
            console.error(err);
            // Rollback on error
            fetchPosts();
        }
    };

    const handleShare = (postId: string) => {
        const baseUrl = window.location.href.split('/forum')[0];
        const url = `${baseUrl}/post/${postId}`;
        
        const copyToClipboard = (text: string) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                return new Promise((resolve, reject) => {
                    if (document.execCommand('copy')) {
                        resolve(true);
                    } else {
                        reject(new Error('Copy failed'));
                    }
                    document.body.removeChild(textArea);
                });
            }
        };

        copyToClipboard(url)
            .then(() => {
                setToast({ msg: lang === "bn" ? "লিঙ্ক কপি হয়েছে!" : "Link copied!", type: "success" });
            })
            .catch(() => {
                setToast({ msg: lang === "bn" ? "কপি করা সম্ভব হয়নি" : "Failed to copy", type: "error" });
            });
    };

    const confirmDelete = async () => {
        if (!deleteModal.postId) return;
        try {
            await forumService.deletePost(deleteModal.postId);
            setToast({ msg: lang === "bn" ? "পোস্ট ডিলিট হয়েছে" : "Post removed", type: "success" });
            setDeleteModal({ isOpen: false, postId: null });
            fetchPosts();
        } catch (err) { setToast({ msg: "Error", type: "error" }); }
    };

    const handleBlock = async (userId: string) => {
        try {
            await forumService.blockUser(userId);
            setToast({ msg: lang === "bn" ? "ইউজার ব্লক করা হয়েছে" : "User blocked", type: "success" });
            fetchPosts();
        } catch (err) {
            setToast({ msg: lang === "bn" ? "ব্লক করা সম্ভব হয়নি" : "Failed to block", type: "error" });
        }
    };

    return (
        <div className="max-w-3xl mx-auto pt-0 pb-10 md:pt-4 md:pb-10 px-3 md:px-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <SEO 
                title={lang === "bn" ? "ফোরাম - কাফআহ" : "Forum - Kafa'ah"} 
                image="https://raw.githubusercontent.com/kafaahbd/Eng2/refs/heads/main/forum.jpg"
                url="/forum"
            />
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, postId: null })}
                onConfirm={confirmDelete}
                title={lang === "bn" ? "পোস্ট ডিলিট করবেন?" : "Delete Post?"}
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

            {/* Post Creation Box */}
            <motion.div 
                onClick={() => navigate("/create-post")}
                className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[35px] shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 mb-5 md:mb-8 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all"
            >
                <div className="flex gap-3 md:gap-4 items-center">
                    <div className={`h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${getProfileColor(user?.name || "")} flex items-center justify-center text-white font-black text-sm md:text-xl shadow-md shadow-blue-500/20 shrink-0 border-2 border-white dark:border-gray-700`}>
                        {user?.name?.[0].toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-400 dark:text-gray-500 font-medium text-xs md:text-base">
                            {lang === "bn" ? "আপনার মনে কি আছে?" : "What's on your mind?"}
                        </p>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 pr-1">
                        <Send size={18} className="md:w-5 md:h-5" />
                    </div>
                </div>
            </motion.div>

            {/* --- Filter Bar --- */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 md:p-3">
                    <div className="flex items-center gap-2 px-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Filter size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                {lang === "bn" ? "ফিল্টার" : "Filters"}
                            </p>
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-none">
                                {activeCategory} • {activeBatch}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {(activeCategory !== "All" || activeBatch !== "All") && (
                            <button 
                                onClick={() => { setActiveCategory("All"); setActiveBatch("All"); }}
                                className="h-10 w-10 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
                        >
                            {lang === "bn" ? "পরিবর্তন" : "Change"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[160] flex items-end md:items-center justify-center p-0 md:p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden" />
                            
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                    {lang === "bn" ? "ফিল্টার অপশন" : "Filter Options"}
                                </h3>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
                                        {lang === "bn" ? "ক্যাটাগরি" : "Category"}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {filterCategories.map((cat) => (
                                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                                className={`px-4 py-3 rounded-2xl text-xs font-black transition-all border ${activeCategory === cat ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500"}`}
                                            >
                                                {cat === "All" ? (lang === "bn" ? "সব" : "All") : cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
                                        {lang === "bn" ? "ব্যাচ" : "Batch"}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {filterBatches.map((b) => (
                                            <button key={b} onClick={() => setActiveBatch(b)}
                                                className={`px-4 py-3 rounded-2xl text-xs font-black transition-all border ${activeBatch === b ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500"}`}
                                            >
                                                {b === "All" ? (lang === "bn" ? "সব" : "All") : b}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs mt-4"
                                >
                                    {lang === "bn" ? "প্রয়োগ করুন" : "Apply Filters"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Feed List */}
            <div className="space-y-4 md:space-y-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="h-12 w-12 md:h-16 md:w-16 rounded-full border-4 border-gray-100 dark:border-gray-800 border-t-blue-600 dark:border-t-blue-500"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="h-2 w-2 md:h-3 md:w-3 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 md:mt-6 text-gray-400 dark:text-gray-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] animate-pulse">
                            {lang === "bn" ? "পোস্ট লোড হচ্ছে..." : "Loading posts..."}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={post.id}
                                    className="bg-white dark:bg-gray-800 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 p-5 md:p-8 group"
                                >
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div className="flex gap-3 md:gap-4">
                                            <div 
                                                onClick={() => navigate(`/profile/${post.user_id}`)}
                                                className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-tr ${getProfileColor(post.author_name)} flex items-center justify-center text-white font-black text-base md:text-lg border-2 border-white dark:border-gray-700 uppercase cursor-pointer shadow-sm`}
                                            >
                                                {post.author_name?.[0]}
                                            </div>
                                            <div>
                                                <h4 
                                                    onClick={() => navigate(`/profile/${post.user_id}`)}
                                                    className="font-black text-gray-900 dark:text-white leading-none text-sm md:text-base cursor-pointer hover:text-blue-600 transition-colors"
                                                >
                                                    {post.author_name}
                                                </h4>
                                                <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                                                    <span className="text-[8px] md:text-[9px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 md:px-2 py-0.5 rounded-md uppercase">{post.category}</span>
                                                    <span className="text-[8px] md:text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 md:px-2 py-0.5 rounded-md uppercase">{post.batch}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 ml-1">{getTimeAgo(post.created_at, lang)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="relative">
                                            <button 
                                                onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                                                className="text-gray-400 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-all"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {activeMenu === post.id && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden p-1"
                                                    >
                                                        {post.user_id === user?.id ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => { setActiveMenu(null); navigate(`/edit-post/${post.id}`); }}
                                                                    className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-xl transition-all"
                                                                >
                                                                    <Edit3 size={16} /> {lang === "bn" ? "এডিট করুন" : "Edit Post"}
                                                                </button>
                                                                <button 
                                                                    onClick={() => { setActiveMenu(null); setDeleteModal({ isOpen: true, postId: post.id }); }}
                                                                    className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 size={16} /> {lang === "bn" ? "ডিলিট করুন" : "Delete Post"}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button 
                                                                onClick={() => { setActiveMenu(null); handleBlock(post.user_id); }}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                            >
                                                                <ShieldAlert size={16} /> {lang === "bn" ? "ব্লক করুন" : "Block User"}
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm md:text-[16px] leading-relaxed mb-5 md:mb-7 font-medium whitespace-pre-wrap">{post.content}</p>
                                    <div className="flex items-center gap-6 md:gap-8 pt-4 md:pt-6 border-t border-gray-50 dark:border-gray-700/30">
                                        <button onClick={() => handleToggleReact(post.id)}
                                            className={`flex items-center gap-2 text-xs md:text-sm font-black transition-all ${post.is_reacted ? "text-red-500" : "text-gray-400"}`}
                                        >
                                            <Heart size={20} className="md:w-[22px] md:h-[22px]" fill={post.is_reacted ? "currentColor" : "none"} /> {post.react_count || 0}
                                        </button>
                                        <button onClick={() => navigate(`/post/${post.id}`)}
                                            className="flex items-center gap-2 text-xs md:text-sm font-black text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <MessageSquare size={20} className="md:w-[22px] md:h-[22px]" /> {post.comment_count || 0}
                                        </button>
                                        <button onClick={() => handleShare(post.id)}
                                            className="flex items-center gap-2 text-xs md:text-sm font-black text-gray-400 hover:text-green-600 transition-colors ml-auto"
                                        >
                                            <Share2 size={18} className="md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-gray-400 font-black uppercase tracking-widest">
                                <Inbox size={50} className="mx-auto mb-4 opacity-20" />
                                {lang === "bn" ? "কোনো পোস্ট পাওয়া যায়নি" : "No posts found"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Forum;