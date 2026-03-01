import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forumService } from '../services/forumService';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, Trash2, X, Clock, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  
  // replyTo.id হবে parent_id (মূল কমেন্টের আইডি)
  // replyTo.mentionName হবে যাকে আমরা মেনশন করছি (রিপ্লাইয়ের ওপর রিপ্লাই দেওয়ার সময়)
  const [replyTo, setReplyTo] = useState<{ id: string; mentionName: string } | null>(null);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const loadPostData = async () => {
    try {
      const posts = await forumService.getPosts();
      const currentPost = posts.find((p: any) => p.id === postId);
      if (!currentPost) navigate('/forum');
      setPost(currentPost);
    } catch (err) { console.error("Error loading post:", err); }
  };

  useEffect(() => { loadPostData(); }, [postId]);

  const handlePostDeleteConfirm = async () => {
    try {
      await forumService.deletePost(postId!);
      navigate('/forum');
    } catch (err) { console.error(err); }
  };

  const handleCommentDeleteConfirm = async () => {
    if (!commentToDelete) return;
    try {
      await forumService.deleteComment(commentToDelete);
      setCommentToDelete(null);
      loadPostData();
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId) return;
    try {
      // replyTo.id ব্যাকঅ্যান্ডে parent_id হিসেবে যাবে
      // এটি সবসময় মূল কমেন্টের আইডি থাকবে যাতে নেস্টিং ১ লেভেলের বেশি না হয়
      await forumService.addComment(postId, commentText, replyTo?.id);
      setCommentText('');
      setReplyTo(null);
      loadPostData();
    } catch (err) { console.error("Submit Error:", err); }
  };

  if (!post) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-black animate-pulse uppercase tracking-[0.3em]">Loading...</div>;

  // --- Threading Logic (Flat Style) ---
  // ১. মূল কমেন্টগুলো (parent_id null)
  const mainComments = post.comments?.filter((c: any) => !c.reply_to_id) || [];
  
  // ২. নির্দিষ্ট কমেন্টের আন্ডারে থাকা সব রিপ্লাই (এগুলো সিরিয়ালি নিচে নিচে থাকবে)
  const getReplies = (parentCommentId: string) => {
    return post.comments?.filter((c: any) => c.reply_to_id === parentCommentId) || [];
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 pb-40">
      
      <ConfirmModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onConfirm={handlePostDeleteConfirm} title="Delete Post?" />
      <ConfirmModal isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)} onConfirm={handleCommentDeleteConfirm} title="Delete Comment?" />

      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 mb-8 font-black text-[10px] tracking-widest uppercase transition-colors">
        <ArrowLeft size={16} /> Back to Forum
      </button>

      {/* Post Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-12">
        <div className="flex gap-4 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
            {post.author_name?.[0]}
          </div>
          <div>
            <h2 className="font-black text-xl dark:text-white leading-tight">{post.author_name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">{post.category}</span>
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Clock size={12}/> {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {post.user_id === user?.id && (
             <button onClick={() => setIsPostModalOpen(true)} className="ml-auto text-red-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
             </button>
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </motion.div>

      {/* Discussions Area */}
      <div className="space-y-10">
        <h3 className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] ml-2">Discussions ({post.comment_count})</h3>
        
        {mainComments.length > 0 ? mainComments.map((c: any) => (
          <div key={c.id} className="space-y-4">
            {/* মেইন কমেন্ট বক্স */}
            <div className="flex gap-4 group">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-black shrink-0 text-gray-500">
                {c.author_name?.[0]}
              </div>
              <div className="flex-1 bg-white dark:bg-gray-800/60 p-5 rounded-[28px] border border-gray-100 dark:border-gray-700 shadow-sm relative group">
                <div className="flex justify-between items-start">
                  <span className="font-black text-blue-500 text-sm">@{c.author_name}</span>
                  {c.comment_author_id === user?.id && (
                    <button onClick={() => setCommentToDelete(c.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{c.comment_text}</p>
                <button 
                    onClick={() => setReplyTo({ id: c.id, mentionName: c.author_name })} 
                    className="mt-3 text-[10px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  Reply
                </button>
              </div>
            </div>

            {/* ফ্ল্যাট রিপ্লাই লিস্ট (এই কমেন্টের অধীনে সব রিপ্লাই) */}
            <div className="ml-14 space-y-4 border-l-2 border-gray-100 dark:border-gray-800/50 pl-6">
              {getReplies(c.id).map((reply: any) => (
                <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} key={reply.id} className="flex gap-3 group">
                  <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">
                    {reply.author_name?.[0]}
                  </div>
                  <div className="flex-1 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-[22px] border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <span className="font-black text-indigo-400 text-xs">@{reply.author_name}</span>
                      {reply.comment_author_id === user?.id && (
                        <button onClick={() => setCommentToDelete(reply.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all">
                            <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                      {/* যদি এটি কোনো রিপ্লাইয়ের ওপর রিপ্লাই হয় তবে @username দেখাবে */}
                      {reply.reply_to_name && (
                        <span className="text-blue-500 font-bold mr-1 italic">@{reply.reply_to_name}</span>
                      )}
                      {reply.comment_text}
                    </p>
                    {/* রিপ্লাইয়ের রিপ্লাই দেওয়ার বাটন - এটিও মূল কমেন্ট (c.id) কেই parent_id হিসেবে ধরবে */}
                    <button 
                        onClick={() => setReplyTo({ id: c.id, mentionName: reply.author_name })} 
                        className="mt-2 text-[8px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )) : (
          <div className="text-center py-10 text-gray-400 font-medium italic opacity-60">No discussions yet. Start the conversation!</div>
        )}
      </div>

      {/* স্টিকি ইনপুট বার */}
      <div className="fixed bottom-8 left-0 right-0 px-4 z-50">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {replyTo && (
              <motion.div 
                initial={{ y: 15, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 15, opacity: 0 }} 
                className="bg-blue-600 text-white px-6 py-2 rounded-t-[25px] text-[10px] font-black flex justify-between items-center mx-5 shadow-lg"
              >
                <span className="flex items-center gap-2 uppercase tracking-widest">
                    <CornerDownRight size={14}/> Replying to @{replyTo.mentionName}
                </span>
                <X size={16} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setReplyTo(null)} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className={`bg-white dark:bg-gray-800 p-3 shadow-2xl border border-gray-100 dark:border-gray-700 flex gap-3 transition-all ${replyTo ? 'rounded-b-[35px] rounded-t-none' : 'rounded-[35px]'}`}>
            <input 
              type="text" 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder={replyTo ? `Write a reply to @${replyTo.mentionName}...` : "Add a comment..."} 
              className="flex-1 bg-transparent px-6 py-2 outline-none dark:text-white font-medium" 
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()} 
            />
            <motion.button 
                whileTap={{ scale: 0.9 }} 
                onClick={handleCommentSubmit} 
                className="bg-blue-600 text-white p-4 rounded-[22px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;