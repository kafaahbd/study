import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { forumService } from '../services/forumService';
import { MessageSquare, Heart, Send, Share2, Clock, Inbox, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Forum: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('Common');
  const [batch, setBatch] = useState('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const fetchPosts = async () => {
    try {
      const data = await forumService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) {
      setToast({ msg: t('forum.validationError'), type: 'error' });
      return;
    }
    try {
      await forumService.createPost(newPost, category, batch);
      setNewPost('');
      setToast({ msg: t('forum.success'), type: 'success' });
      fetchPosts();
    } catch (err) {
      setToast({ msg: t('forum.error'), type: 'error' });
    }
  };

  const handleToggleReact = async (postId: string) => {
    try {
      await forumService.toggleReact(postId);
      fetchPosts();
    } catch (err) {}
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      await forumService.addComment(postId, commentText);
      setCommentText('');
      fetchPosts();
    } catch (err) {}
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      
      {/* --- Premium Spring Toast Notification --- */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-8 py-4 rounded-full shadow-2xl font-black text-white text-sm flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}
          >
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Create Post Section --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-10 overflow-hidden"
      >
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-none">
            {user?.name?.[0].toUpperCase()}
          </div>
          <form onSubmit={handlePostSubmit} className="flex-1">
            <textarea
              className="w-full bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white transition-all placeholder-gray-400"
              placeholder={t('forum.placeholder')}
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            
            <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
              <div className="flex gap-3">
                {/* Category Selector with Animation */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
                  <select 
                    className="appearance-none text-xs bg-gray-100 dark:bg-gray-700 pl-4 pr-10 py-2.5 rounded-2xl border-none font-bold dark:text-gray-200 outline-none cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Common">{t('forum.common')}</option>
                    <option value="Science">{t('forum.science')}</option>
                    <option value="Arts">{t('forum.arts')}</option>
                    <option value="Commerce">{t('forum.commerce')}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </motion.div>

                {/* Batch Selector with Animation */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
                  <select 
                    className="appearance-none text-xs bg-gray-100 dark:bg-gray-700 pl-4 pr-10 py-2.5 rounded-2xl border-none font-bold dark:text-gray-200 outline-none cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors shadow-sm"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                  >
                    <option value="All">{t('forum.allBatches')}</option>
                    <option value="SSC">📖 SSC</option>
                    <option value="HSC">📚 HSC</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </motion.div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <Send size={16} /> {t('forum.postBtn')}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* --- Post Feed --- */}
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              key={post.id} 
              className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 p-6 cursor-default transition-shadow hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none"
            >
              {/* Post Header */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-blue-600 font-black border dark:border-gray-600">
                    {post.author_name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white leading-none">{post.author_name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{post.batch}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <Clock size={10} /> {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-8 pt-5 border-t border-gray-50 dark:border-gray-700/50">
                <motion.button 
                  whileTap={{ scale: 1.4 }}
                  onClick={() => handleToggleReact(post.id)} 
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.is_reacted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart size={22} fill={post.is_reacted ? "currentColor" : "none"} strokeWidth={2.5} />
                  <span>{post.react_count || 0}</span>
                </motion.button>

                <motion.button 
                  whileHover={{ y: -2 }}
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)} 
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${activePostId === post.id ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  <MessageSquare size={22} strokeWidth={2.5} />
                  <span>{t('forum.comment')}</span>
                </motion.button>

                <motion.button whileHover={{ rotate: 15 }} className="text-gray-300 hover:text-gray-500 ml-auto transition-colors">
                  <Share2 size={20} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Comment Section with Animation */}
              <AnimatePresence>
                {activePostId === post.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700/50"
                  >
                    <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                      {post.comments?.length > 0 ? post.comments.map((c: any) => (
                        <motion.div initial={{ x: -10 }} animate={{ x: 0 }} key={c.id} className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black shrink-0">{c.author_name?.[0]}</div>
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-2xl flex-1 border border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] font-black dark:text-white mb-1">{c.author_name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{c.comment_text}</p>
                          </div>
                        </motion.div>
                      )) : (
                        <p className="text-[10px] text-center text-gray-400 italic font-medium">{t('forum.noComments')}</p>
                      )}
                    </div>
                    
                    {/* Comment Input */}
                    <div className="flex gap-2 bg-gray-100 dark:bg-gray-900/50 p-2 rounded-[20px] focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                      <input 
                        type="text" 
                        placeholder={t('forum.writeComment')} 
                        className="flex-1 bg-transparent border-none px-3 py-2 text-xs outline-none dark:text-white placeholder-gray-400 font-medium" 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                      />
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCommentSubmit(post.id)} 
                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none"
                      >
                        <Send size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          /* --- No Post Empty State --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-50"
          >
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-[40px] mb-4">
              <Inbox size={64} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-gray-500 font-black text-lg tracking-tight uppercase">{t('forum.noPosts')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Forum;