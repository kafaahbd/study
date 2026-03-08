import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { forumService } from "../services/forumService";
import SEO from "../components/SEO";
import { 
    Send, Layers, GraduationCap, ChevronDown, Check, ArrowLeft, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileColor } from "../typescriptfile/utils";

const CreatePost: React.FC = () => {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const { postId } = useParams();
    
    const isEditing = !!postId;

    const [content, setContent] = useState("");
    const [category, setCategory] = useState<string>("Common");
    const [batch, setBatch] = useState<string>("SSC");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isBatchOpen, setIsBatchOpen] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const categories = ["Common", "Science", "Arts", "Commerce"];
    const postBatches = ["SSC", "HSC", "All"];

    useEffect(() => {
        if (isEditing && postId) {
            const fetchPost = async () => {
                try {
                    const post = await forumService.getPostById(postId);
                    setContent(post.content);
                    setCategory(post.category);
                    setBatch(post.batch);
                } catch {
                    setToast({ msg: lang === "bn" ? "পোস্ট লোড করা সম্ভব হয়নি" : "Failed to load post", type: "error" });
                } finally {
                    setFetching(false);
                }
            };
            fetchPost();
        }
    }, [isEditing, postId, lang]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!content.trim()) return;

        setLoading(true);
        try {
            if (isEditing && postId) {
                await forumService.updatePost(postId, content, category, batch);
                setToast({ msg: lang === "bn" ? "পোস্ট আপডেট হয়েছে!" : "Post updated!", type: "success" });
            } else {
                await forumService.createPost(content, category, batch);
                setToast({ msg: lang === "bn" ? "পোস্ট শেয়ার হয়েছে!" : "Post shared!", type: "success" });
            }
            setTimeout(() => navigate("/forum"), 1500);
        } catch {
            setToast({ msg: lang === "bn" ? "ব্যর্থ হয়েছে" : "Failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
            <SEO 
                title={isEditing ? (lang === "bn" ? "পোস্ট এডিট করুন" : "Edit Post") : (lang === "bn" ? "নতুন পোস্ট" : "New Post")}
                url="/create-post"
            />

            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
                        <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-lg font-black text-gray-900 dark:text-white">
                        {isEditing ? (lang === "bn" ? "পোস্ট এডিট করুন" : "Edit Post") : (lang === "bn" ? "পোস্ট তৈরি করুন" : "Create Post")}
                    </h1>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !content.trim()}
                        className="bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {lang === "bn" ? (isEditing ? "আপডেট" : "পোস্ট") : (isEditing ? "Update" : "Post")}
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${getProfileColor(user?.name || "")} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 border-2 border-white dark:border-gray-700`}>
                        {user?.name?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 dark:text-white leading-none">{user?.name}</h4>
                        <div className="flex gap-2 mt-2">
                            {/* Category Selector */}
                            <div className="relative">
                                <button onClick={() => setIsCatOpen(!isCatOpen)}
                                    className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-black dark:text-gray-200"
                                >
                                    <Layers size={12} className="text-blue-500" />
                                    {category}
                                    <ChevronDown size={12} />
                                </button>
                                <AnimatePresence>
                                    {isCatOpen && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 2 }} exit={{ opacity: 0, y: 5 }}
                                            className="absolute left-0 top-full z-[120] w-32 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-1 mt-1"
                                        >
                                            {categories.map((cat) => (
                                                <button key={cat} onClick={() => { setCategory(cat); setIsCatOpen(false); }}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold rounded-lg ${category === cat ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                                >
                                                    {cat} {category === cat && <Check size={10} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Batch Selector */}
                            <div className="relative">
                                <button onClick={() => setIsBatchOpen(!isBatchOpen)}
                                    className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-black dark:text-gray-200"
                                >
                                    <GraduationCap size={12} className="text-indigo-500" />
                                    {batch}
                                    <ChevronDown size={12} />
                                </button>
                                <AnimatePresence>
                                    {isBatchOpen && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 2 }} exit={{ opacity: 0, y: 5 }}
                                            className="absolute left-0 top-full z-[120] w-32 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-1 mt-1"
                                        >
                                            {postBatches.map((b) => (
                                                <button key={b} onClick={() => { setBatch(b); setIsBatchOpen(false); }}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold rounded-lg ${batch === b ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                                >
                                                    {b} {batch === b && <Check size={10} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Area */}
                <textarea
                    autoFocus
                    className="w-full bg-transparent border-none text-lg md:text-xl outline-none resize-none dark:text-white placeholder:text-gray-400 font-medium min-h-[300px]"
                    placeholder={lang === "bn" ? "আপনার মনে কি আছে?" : "What's on your mind?"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

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
        </div>
    );
};

export default CreatePost;
