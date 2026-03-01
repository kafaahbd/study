import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { forumService } from '../services/forumService';
import { MessageSquare, Heart, Send, Share2, Clock, Inbox, ChevronDown, Trash2, X } from 'lucide-react';
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
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
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

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await forumService.deletePost(postId);
      setToast({ msg: "Post deleted successfully", type: 'success' });
      fetchPosts();
    } catch (err) {
      setToast({ msg: "Failed to delete post", type: 'error' });
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
      await forumService.addComment(postId, commentText, replyTo?.id);
      setCommentText('');
      setReplyTo(null);
      fetchPosts(); // সম্পূর্ণ লিস্ট রিফ্রেশ করে কাউন্ট আপডেট করা
    } catch (err) {
      setToast({ msg: t('forum.error'), type: 'error' });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await forumService.deleteComment(commentId);
      fetchPosts();
    } catch (err) {
      setToast({ msg: "Error deleting comment", type: 'error' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      
      {/* Global Spring Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-8 py-4 rounded-full shadow-2xl font-black text-white text-sm flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}
          >
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-[35px] shadow-sm border border-gray-100 dark:border-gray-700 p-7 mb-10"
      >
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {user?.name?.[0].toUpperCase()}
          </div>
          <form onSubmit={handlePostSubmit} className="flex-1">
            <textarea
              className="w-full bg-gray-50 dark:bg-gray-700/40 border-none rounded-[25px] p-5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none dark:text-white transition-all placeholder-gray-400"
              placeholder={t('forum.placeholder')}
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            
            <div className="flex flex-wrap justify-between items-end mt-6 gap-4">
              <div className="flex gap-4 flex-1 sm:flex-initial">
                <div className="relative flex-1 sm:w-40">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-3 mb-1.5 block">Category</label>
                  <select 
                    className="w-full appearance-none bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 font-bold text-xs pl-5 pr-10 py-3.5 rounded-[18px] border-2 border-transparent focus:border-blue-500/20 focus:bg-white outline-none cursor-pointer transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Common">{t('forum.common')}</option>
                    <option value="Science">{t('forum.science')}</option>
                    <option value="Arts">{t('forum.arts')}</option>
                    <option value="Commerce">{t('forum.commerce')}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1 sm:w-40">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-3 mb-1.5 block">Batch</label>
                  <select 
                    className="w-full appearance-none bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 font-bold text-xs pl-5 pr-10 py-3.5 rounded-[18px] border-2 border-transparent focus:border-green-500/20 focus:bg-white outline-none cursor-pointer transition-all"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                  >
                    <option value="All">{t('forum.allBatches')}</option>
                    <option value="SSC">📖 SSC</option>
                    <option value="HSC">📚 HSC</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[20px] text-sm font-black flex items-center gap-2 shadow-xl"
              >
                <Send size={18} /> {t('forum.postBtn')}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Feed */}
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={post.id} 
              className="bg-white dark:bg-gray-800 rounded-[35px] shadow-sm border border-gray-100 dark:border-gray-700 p-7"
            >
              {/* Post Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-blue-600 font-black border dark:border-gray-600 text-lg">
                    {post.author_name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg leading-none">{post.author_name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] bg-blue-100/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">{post.category}</span>
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{post.batch}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-[10px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    {post.user_id === user?.id && (
                        <button onClick={() => handleDeletePost(post.id)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed mb-7 whitespace-pre-wrap font-medium">{post.content}</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-10 pt-6 border-t border-gray-50 dark:border-gray-700/30">
                <motion.button 
                  whileTap={{ scale: 1.5, rotate: -15 }}
                  onClick={() => handleToggleReact(post.id)} 
                  className={`flex items-center gap-2.5 text-sm font-black transition-colors ${post.is_reacted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart size={24} fill={post.is_reacted ? "currentColor" : "none"} />
                  <span>{post.react_count || 0}</span>
                </motion.button>

                <motion.button 
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)} 
                  className={`flex items-center gap-2.5 text-sm font-black transition-colors ${activePostId === post.id ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  <MessageSquare size={24} />
                  <span>{post.comment_count || 0} {t('forum.comment')}</span>
                </motion.button>

                <motion.button className="text-gray-300 hover:text-gray-500 ml-auto">
                  <Share2 size={22} />
                </motion.button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {activePostId === post.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 overflow-hidden">
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                      {post.comments?.length > 0 ? post.comments.map((c: any) => (
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={c.id} className="flex gap-3">
                          <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black shrink-0">{c.author_name?.[0]}</div>
                          <div className="bg-gray-50 dark:bg-gray-700/20 p-4 rounded-[22px] flex-1 border border-gray-100 dark:border-gray-700 group relative">
                            <p className="text-[11px] font-black dark:text-white mb-1 opacity-80">
                                {c.author_name} 
                                {c.reply_to_name && <span className="text-blue-500 ml-1">replied to @{c.reply_to_name}</span>}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-normal font-medium">{c.comment_text}</p>
                            
                            <div className="flex gap-4 mt-2">
                                <button onClick={() => setReplyTo({id: c.id, name: c.author_name})} className="text-[10px] font-bold text-gray-400 hover:text-blue-500 uppercase tracking-widest">Reply</button>
                                {c.comment_author_id === user?.id && (
                                    <button onClick={() => handleDeleteComment(c.id)} className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-widest">Delete</button>
                                )}
                            </div>
                          </div>
                        </motion.div>
                      )) : (
                        <p className="text-xs text-center text-gray-400 py-4 font-bold italic tracking-wide">{t('forum.noComments')}</p>
                      )}
                    </div>
                    
                    {/* Input Field with Reply Mention */}
                    <div className="relative">
                        {replyTo && (
                            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-t-2xl text-[10px] text-blue-600 font-bold border-b border-blue-100 dark:border-blue-800">
                                <span>Replying to <b>@{replyTo.name}</b></span>
                                <X size={14} className="cursor-pointer" onClick={() => setReplyTo(null)} />
                            </div>
                        )}
                        <div className={`flex gap-3 bg-gray-50 dark:bg-gray-900/40 p-2.5 border-2 border-transparent focus-within:border-blue-500/30 transition-all ${replyTo ? 'rounded-b-[25px]' : 'rounded-[25px]'}`}>
                            <input 
                                type="text" 
                                placeholder={t('forum.writeComment')} 
                                className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none dark:text-white font-bold" 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)} 
                            />
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCommentSubmit(post.id)} 
                                className="p-3.5 bg-blue-600 text-white rounded-[18px] hover:bg-blue-700 shadow-lg"
                            >
                                <Send size={16} />
                            </motion.button>
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          /* Empty State */
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-28">
            <div className="bg-white dark:bg-gray-800 p-12 rounded-[50px] shadow-sm border border-gray-100 dark:border-gray-700 mb-6 group transition-all">
              <Inbox size={70} className="text-gray-200 dark:text-gray-700" />
            </div>
            <p className="text-gray-400 dark:text-gray-600 font-black text-xl uppercase tracking-[0.3em]">{t('forum.noPosts')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Forum;