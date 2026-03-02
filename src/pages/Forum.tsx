import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { forumService } from "../services/forumService";
import {
    MessageSquare, Heart, Inbox, Trash2, Send,
    Layers, GraduationCap, ChevronDown, Check, Filter, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";

const Forum: React.FC = () => {
    const { user } = useAuth();
    const { t, lang } = useLanguage();
    const navigate = useNavigate();

    // UI States
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState("");
    const [loading, setLoading] = useState(false);

    // Post Creation Selection
    const [category, setCategory] = useState("Common");
    const [batch, setBatch] = useState("SSC"); // Default Batch
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isBatchOpen, setIsBatchOpen] = useState(false);

    // --- Filtering States ---
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeBatch, setActiveBatch] = useState("All");

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: string | null }>({
        isOpen: false, postId: null,
    });

    const categories = ["Common", "Science", "Arts", "Commerce"];
    const filterCategories = ["All", ...categories];
    const batches = ["SSC", "HSC"];
    const filterBatches = ["All", ...batches];

    // পোস্ট ফেচ করার মেইন ফাংশন
    const fetchPosts = async () => {
        setLoading(true);
        try {
            // সার্ভিস এ ফিল্টার ভ্যালু পাস করা হচ্ছে
            const data = await forumService.getPosts(activeCategory, activeBatch);
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    // যখনই ফিল্টার পরিবর্তন হবে, এই useEffect কল হবে
    useEffect(() => {
        fetchPosts();
    }, [activeCategory, activeBatch]);

    // সাকসেস/এরর মেসেজ টাইমার
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        try {
            await forumService.createPost(newPost, category, batch);
            setNewPost("");
            setToast({ msg: t("forum.success"), type: "success" });
            fetchPosts(); // নতুন পোস্ট করার পর লিস্ট রিফ্রেশ
        } catch (err) {
            setToast({ msg: t("forum.error"), type: "error" });
        }
    };

    const handleToggleReact = async (postId: string) => {
        try {
            await forumService.toggleReact(postId);
            // রিঅ্যাক্ট দিলে পুরো লিস্ট ফেচ না করে লোকাললি আপডেট করা ভালো, তবে আপাতত সিম্পল রাখছি
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    const confirmDelete = async () => {
        if (!deleteModal.postId) return;
        try {
            await forumService.deletePost(deleteModal.postId);
            setToast({ msg: "Post removed", type: "success" });
            setDeleteModal({ isOpen: false, postId: null });
            fetchPosts();
        } catch (err) { setToast({ msg: "Error", type: "error" }); }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, postId: null })}
                onConfirm={confirmDelete}
                title="Delete Post?"
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

            {/* Post Box */}
            <motion.div className="bg-white dark:bg-gray-800 rounded-[45px] shadow-2xl shadow-blue-500/5 border border-white dark:border-gray-700/50 p-3 mb-8">
                <div className="bg-gray-50/50 dark:bg-gray-900/40 rounded-[40px] p-6">
                    <div className="flex gap-4 items-start">
                        <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/30 shrink-0">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <textarea
                                className="w-full bg-transparent border-none p-2 text-[16px] outline-none resize-none dark:text-white placeholder:text-gray-400 font-medium mt-2"
                                placeholder={t("forum.placeholder")}
                                rows={3}
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 gap-4">
                        <div className="flex gap-3">
                            {/* Category Dropdown */}
                            <div className="relative">
                                <button onClick={() => { setIsCatOpen(!isCatOpen); setIsBatchOpen(false); }}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-[11px] font-black dark:text-gray-200"
                                >
                                    <Layers size={14} className="text-blue-500" />
                                    {category}
                                    <motion.div animate={{ rotate: isCatOpen ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
                                </button>
                                <AnimatePresence>
                                    {isCatOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 5 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 top-full z-[120] w-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-1"
                                        >
                                            {categories.map((cat) => (
                                                <button key={cat} onClick={() => { setCategory(cat); setIsCatOpen(false); }}
                                                    className={`flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-bold rounded-xl ${category === cat ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                                >
                                                    {cat} {category === cat && <Check size={12} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Batch Dropdown */}
                            <div className="relative">
                                <button onClick={() => { setIsBatchOpen(!isBatchOpen); setIsCatOpen(false); }}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-[11px] font-black dark:text-gray-200"
                                >
                                    <GraduationCap size={14} className="text-indigo-500" />
                                    {batch}
                                    <motion.div animate={{ rotate: isBatchOpen ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
                                </button>
                                <AnimatePresence>
                                    {isBatchOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 5 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 top-full z-[120] w-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-1"
                                        >
                                            {batches.map((b) => (
                                                <button key={b} onClick={() => { setBatch(b); setIsBatchOpen(false); }}
                                                    className={`flex items-center justify-between w-full px-4 py-2.5 text-[11px] font-bold rounded-xl ${batch === b ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                                >
                                                    {b} {batch === b && <Check size={12} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePostSubmit}
                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[13px] font-black shadow-lg shadow-blue-500/30 flex items-center gap-2"
                        >
                            <Send size={16} /> {lang === "bn" ? "পোস্ট করুন" : "Post"}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* --- Filter Bar --- */}
            <div className="sticky top-4 z-[100] mb-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 min-w-max">
                        <div className="p-2 ml-2 text-blue-600 dark:text-blue-400"><Filter size={18} /></div>

                        <div className="flex gap-1.5 border-r border-gray-100 dark:border-gray-700 pr-3 mr-1">
                            {filterCategories.map((cat) => (
                                <button key={cat} onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-2xl text-[11px] font-black transition-all ${activeCategory === cat ? "bg-blue-600 text-white shadow-lg" : "bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-gray-600"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-1.5">
                            {filterBatches.map((b) => (
                                <button key={b} onClick={() => setActiveBatch(b)}
                                    className={`px-4 py-1.5 rounded-2xl text-[11px] font-black transition-all ${activeBatch === b ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-gray-600"}`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>

                        {(activeCategory !== "All" || activeBatch !== "All") && (
                            <button onClick={() => { setActiveCategory("All"); setActiveBatch("All"); }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Feed List */}
            <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading posts...</div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={post.id}
                                    className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 p-8 group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-blue-600 font-black text-lg border dark:border-gray-700">
                                                {post.author_name?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white leading-none">{post.author_name}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md uppercase">{post.category}</span>
                                                    <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md uppercase">{post.batch}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {post.user_id === user?.id && (
                                            <button onClick={() => setDeleteModal({ isOpen: true, postId: post.id })}
                                                className="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed mb-7 font-medium whitespace-pre-wrap">{post.content}</p>
                                    <div className="flex items-center gap-8 pt-6 border-t border-gray-50 dark:border-gray-700/30">
                                        <button onClick={() => handleToggleReact(post.id)}
                                            className={`flex items-center gap-2 text-sm font-black transition-all ${post.is_reacted ? "text-red-500" : "text-gray-400"}`}
                                        >
                                            <Heart size={22} fill={post.is_reacted ? "currentColor" : "none"} /> {post.react_count || 0}
                                        </button>
                                        <button onClick={() => navigate(`/post/${post.id}`)}
                                            className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <MessageSquare size={22} /> {post.comment_count || 0}
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