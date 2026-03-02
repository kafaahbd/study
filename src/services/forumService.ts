import axios from "axios";

// .env ফাইল থেকে API URL নেওয়া
const API_URL = import.meta.env.VITE_API_URL + "/forum";

// Authorization Header তৈরির জন্য হেল্পার ফাংশন
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  };
};

export const forumService = {
  // ১. সব পোস্ট ফেচ করা (ফিল্টার সাপোর্টসহ)
  // category এবং batch অপশনাল, না পাঠালে সব পোস্ট আসবে
  getPosts: async (category?: string, batch?: string) => {
    let url = `${API_URL}/posts`;
    
    // কুয়েরি প্যারামিটার যোগ করা
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (batch && batch !== 'All') params.append('batch', batch);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  // ২. নতুন পোস্ট তৈরি করা
  createPost: async (content: string, category: string, batch: string) => {
    const response = await axios.post(
      `${API_URL}/posts`,
      { content, category, batch },
      getAuthHeader()
    );
    return response.data;
  },

  // ৩. পোস্ট ডিলিট করা
  deletePost: async (postId: string) => {
    const response = await axios.delete(
      `${API_URL}/posts/${postId}`, 
      getAuthHeader()
    );
    return response.data;
  },

  // ৪. কমেন্ট অথবা রিপ্লাই যোগ করা
  addComment: async (postId: string, commentText: string, parentId: string | null = null) => {
    const response = await axios.post(
      `${API_URL}/comments`,
      { 
        post_id: postId, 
        comment_text: commentText,
        parent_id: parentId // রিপ্লাইয়ের জন্য parent_id ব্যবহার হয়
      },
      getAuthHeader()
    );
    return response.data;
  },

  // ৫. কমেন্ট ডিলিট করা
  deleteComment: async (commentId: string) => {
    const response = await axios.delete(
      `${API_URL}/comments/${commentId}`, 
      getAuthHeader()
    );
    return response.data;
  },

  // ৬. রিঅ্যাক্ট (Like) টগল করা
  toggleReact: async (postId: string) => {
    const response = await axios.post(
      `${API_URL}/react`,
      { post_id: postId },
      getAuthHeader()
    );
    return response.data;
  },
};