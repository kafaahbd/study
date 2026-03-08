import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { forumService } from '../services/forumService';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, Trash2, X, Clock, CornerDownRight, Share2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import TextExpander from '../components/TextExpander';
import ImageViewer from '../components/ImageViewer';
import { useLanguage } from '../contexts/LanguageContext';
import { getProfileColor, getTimeAgo } from '../typescriptfile/utils';

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  
  // parentId হবে মূল কমেন্টের আইডি (গ্রুপিংয়ের জন্য)
  // replyId হবে নির্দিষ্ট কমেন্টের আইডি (মেনশনের জন্য)
  // mentionName হবে যাকে আমরা মেনশন করছি
  const [replyTo, setReplyTo] = useState<{ parentId: string; replyId: string; mentionName: string } | null>(null);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const loadPostData = useCallback(async () => {
    if (!postId) return;
    try {
      const currentPost = await forumService.getPostById(postId);
      if (!currentPost) navigate('/forum');
      setPost(currentPost);
    } catch (err) { 
      console.error("Error loading post:", err);
      navigate('/forum');
    }
  }, [postId, navigate]);

  useEffect(() => { 
    const timer = setTimeout(() => {
      loadPostData(); 
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPostData]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCommentImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      alert("Please login to comment");
      return;
    }
    if ((!commentText.trim() && !commentImage) || !postId) return;
    try {
      // replyTo.parentId ব্যাকঅ্যান্ডে parent_id হিসেবে যাবে (গ্রুপিংয়ের জন্য)
      // replyTo.replyId ব্যাকঅ্যান্ডে reply_to_id হিসেবে যাবে (মেনশনের জন্য)
      await forumService.addComment(postId, commentText, replyTo?.parentId, replyTo?.replyId, commentImage || undefined);
      setCommentText('');
      setCommentImage(null);
      setReplyTo(null);
      loadPostData();
    } catch (err) { console.error("Submit Error:", err); }
  };

  const handleShare = () => {
    const url = window.location.href;
    
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
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  };

  if (!post) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-black animate-pulse uppercase tracking-[0.3em]">Loading...</div>;

  // --- Threading Logic (Flat Style) ---
  // ১. মূল কমেন্টগুলো (parent_id null)
  const mainComments = post.comments?.filter((c: any) => !c.parent_id) || [];
  
  // ২. নির্দিষ্ট কমেন্টের আন্ডারে থাকা সব রিপ্লাই (এগুলো সিরিয়ালি নিচে নিচে থাকবে)
  const getReplies = (parentCommentId: string) => {
    return post.comments?.filter((c: any) => c.parent_id === parentCommentId) || [];
  };

  return (
    <div className="max-w-3xl mx-auto pt-0 pb-40 md:pt-4 md:pb-40 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <ConfirmModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onConfirm={handlePostDeleteConfirm} title="Delete Post?" />
      <ConfirmModal isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)} onConfirm={handleCommentDeleteConfirm} title="Delete Comment?" />

      {selectedImage && (
          <ImageViewer 
              src={selectedImage} 
              onClose={() => setSelectedImage(null)} 
          />
      )}

      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 mb-8 font-black text-[10px] tracking-widest uppercase transition-colors">
        <ArrowLeft size={16} /> Back to Forum
      </button>

      {/* Post Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex gap-4 mb-4">
          <div 
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${post.author_profile_color || getProfileColor(post.author_name)} text-white flex items-center justify-center font-black text-lg shadow-sm cursor-pointer border-2 border-white dark:border-gray-700`}
          >
            {post.author_name?.[0]}
          </div>
          <div>
            <h2 
              onClick={() => navigate(`/profile/${post.user_id}`)}
              className="font-black text-lg dark:text-white leading-tight cursor-pointer hover:text-blue-600 transition-colors"
            >
              {post.author_name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">{post.category}</span>
              <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1"><Clock size={10}/> {getTimeAgo(post.created_at, lang)}</span>
            </div>
          </div>
          {post.user_id === user?.id && (
             <button onClick={() => setIsPostModalOpen(true)} className="ml-auto text-red-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={16} />
             </button>
          )}
          <button onClick={handleShare} className="text-gray-400 hover:text-green-500 transition-colors p-2 ml-2">
            <Share2 size={16} />
          </button>
        </div>
        <TextExpander text={post.content} limit={150} className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap" />
        {post.image && (
            <div className="mt-4">
                <img 
                    src={post.image} 
                    alt="Post content" 
                    onClick={() => setSelectedImage(post.image)}
                    className="w-full max-h-96 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity" 
                />
            </div>
        )}
      </motion.div>

      {/* Discussions Area */}
      <div className="space-y-10">
        <h3 className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] ml-2">Discussions ({post.comment_count})</h3>
        
        {mainComments.length > 0 ? mainComments.map((c: any) => (
          <div key={c.id} className="space-y-4">
            {/* মেইন কমেন্ট বক্স */}
            <div className="flex gap-4 group">
              <Link to={`/profile/${c.comment_author_id}`} className="shrink-0">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${c.author_profile_color || getProfileColor(c.author_name)} flex items-center justify-center text-white font-black text-xs border border-white dark:border-gray-700 shadow-sm`}>
                      {c.author_name?.[0]}
                  </div>
              </Link>
              <div className="flex-1 bg-white dark:bg-gray-800/60 p-5 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-sm relative group">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/profile/${c.comment_author_id}`} className="font-black text-blue-500 text-sm">@{c.author_name}</Link>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-bold">{getTimeAgo(c.created_at, lang)}</span>
                    {c.comment_author_id === user?.id && (
                      <button onClick={() => setCommentToDelete(c.id)} className="text-red-400 hover:text-red-500 transition-all">
                          <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <TextExpander text={c.comment_text} limit={50} className="text-gray-600 dark:text-gray-300" />
                {c.image && (
                    <div className="mt-2">
                        <img 
                            src={c.image} 
                            alt="Comment attachment" 
                            onClick={() => setSelectedImage(c.image)}
                            className="max-w-xs max-h-48 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity" 
                        />
                    </div>
                )}
                <div className="flex items-center gap-4 mt-3">
                    {user && (
                      <button 
                          onClick={() => setReplyTo({ parentId: c.id, replyId: c.id, mentionName: c.author_name })} 
                          className="text-[10px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-colors"
                      >
                        Reply
                      </button>
                    )}
                    {getReplies(c.id).length > 0 && (
                        <button 
                            onClick={() => setShowReplies(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                            className="text-[10px] font-black text-blue-500 uppercase tracking-widest transition-colors"
                        >
                            {showReplies[c.id] ? "Hide Replies" : `Show ${getReplies(c.id).length} Replies`}
                        </button>
                    )}
                </div>
              </div>
            </div>

            {/* ফ্ল্যাট রিপ্লাই লিস্ট */}
            {showReplies[c.id] && (
                <div className="ml-14 space-y-4 border-l-2 border-gray-100 dark:border-gray-800/50 pl-6">
                {getReplies(c.id).map((reply: any) => (
                    <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} key={reply.id} className="flex gap-3 group">
                    <Link to={`/profile/${reply.comment_author_id}`} className="shrink-0">
                        <div className={`h-6 w-6 rounded-md bg-gradient-to-tr ${reply.author_profile_color || getProfileColor(reply.author_name)} flex items-center justify-center text-white font-black text-[10px] border border-white dark:border-gray-700 shadow-sm`}>
                            {reply.author_name?.[0]}
                        </div>
                    </Link>
                    <div className="flex-1 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-[20px] border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-1">
                        <Link to={`/profile/${reply.comment_author_id}`} className="font-black text-indigo-400 text-xs">@{reply.author_name}</Link>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-gray-400 font-bold">{getTimeAgo(reply.created_at, lang)}</span>
                            {reply.comment_author_id === user?.id && (
                                <button onClick={() => setCommentToDelete(reply.id)} className="text-red-400 hover:text-red-500 transition-all">
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                        </div>
                        <TextExpander text={reply.comment_text} limit={50} className="text-gray-500 dark:text-gray-400 text-sm" />
                        {reply.image && (
                            <div className="mt-2">
                                <img 
                                    src={reply.image} 
                                    alt="Reply attachment" 
                                    onClick={() => setSelectedImage(reply.image)}
                                    className="max-w-xs max-h-40 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity" 
                                />
                            </div>
                        )}
                        {user && (
                        <button 
                            onClick={() => setReplyTo({ parentId: c.id, replyId: reply.id, mentionName: reply.author_name })} 
                            className="mt-2 text-[8px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-colors"
                        >
                            Reply
                        </button>
                        )}
                    </div>
                    </motion.div>
                ))}
                </div>
            )}
          </div>
        )) : (
          <div className="text-center py-10 text-gray-400 font-medium italic opacity-60">No discussions yet. Start the conversation!</div>
        )}
      </div>

      {/* স্টিকি ইনপুট বার */}
      <div className="fixed bottom-8 left-0 right-0 px-4 z-50">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {/* Nav Toggle Button */}
          <div className="flex justify-end pr-4">
          </div>

          {!user ? (
            <div className="bg-white dark:bg-gray-800 p-4 shadow-2xl border border-gray-100 dark:border-gray-700 rounded-[35px] text-center">
              <p className="text-gray-500 dark:text-gray-400 font-bold">
                Login to join the discussion
              </p>
              <button 
                onClick={() => navigate("/login")}
                className="mt-2 text-blue-600 font-black uppercase text-[10px] tracking-widest"
              >
                Login Now
              </button>
            </div>
          ) : (
            <>
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
              
              <div className={`bg-white dark:bg-gray-800 p-3 shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-2 transition-all ${replyTo ? 'rounded-b-[35px] rounded-t-none' : 'rounded-[35px]'}`}>
                {commentImage && (
                    <div className="relative mx-4 mt-2">
                        <img src={commentImage} alt="Preview" className="h-20 w-auto object-cover rounded-lg" />
                        <button 
                            onClick={() => setCommentImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        <ImageIcon size={24} />
                    </button>
                    <input 
                      type="text" 
                      value={commentText} 
                      onChange={(e) => setCommentText(e.target.value)} 
                      placeholder={replyTo ? `Write a reply to @${replyTo.mentionName}...` : "Add a comment..."} 
                      className="flex-1 bg-transparent px-2 py-2 outline-none dark:text-white font-medium" 
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()} 
                    />
                    <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={handleCommentSubmit} 
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                    >
                      <Send size={20} />
                    </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
