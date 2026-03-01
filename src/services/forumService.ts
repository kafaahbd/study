import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/forum";

// Token local storage theke newar jonno helper function
const getAuthHeader = () => ({
  headers: { 
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  },
});

export const forumService = {
  // ১. সব পোস্ট ফেচ করা
  getPosts: async () => {
    const response = await axios.get(`${API_URL}/posts`, getAuthHeader());
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
  // parent_id পাঠালে সেটি অটোমেটিক রিপ্লাই হিসেবে গণ্য হবে
  addComment: async (postId: string, commentText: string, parentId: string | null = null) => {
    const response = await axios.post(
      `${API_URL}/comments`,
      { 
        post_id: postId, 
        comment_text: commentText,
        parent_id: parentId // Reply-er jonno parent_id
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