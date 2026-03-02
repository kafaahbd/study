import axios from "axios";

// .env ফাইল থেকে API URL নেওয়া (Vite প্রজেক্টের জন্য)
const API_URL = import.meta.env.VITE_API_URL + "/forum";

/**
 * Authorization Header তৈরির জন্য হেল্পার ফাংশন
 * এটি প্রতিবার রিকোয়েস্ট পাঠানোর সময় লেটেস্ট টোকেনটি সংগ্রহ করবে।
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const forumService = {
  /**
   * ১. সব পোস্ট ফেচ করা (ফিল্টার সাপোর্টসহ)
   * @param category - যেমন: 'Science', 'Arts', 'Common' (ঐচ্ছিক)
   * @param batch - যেমন: 'SSC', 'HSC' (ঐচ্ছিক)
   */
  getPosts: async (category?: string, batch?: string) => {
    let url = `${API_URL}/posts`;
    
    // কুয়েরি প্যারামিটার ডাইনামিকালি যোগ করা
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

  /**
   * ২. নতুন পোস্ট তৈরি করা
   */
  createPost: async (content: string, category: string, batch: string) => {
    const response = await axios.post(
      `${API_URL}/posts`,
      { content, category, batch },
      getAuthHeader()
    );
    return response.data;
  },

  /**
   * ৩. পোস্ট ডিলিট করা
   */
  deletePost: async (postId: string) => {
    const response = await axios.delete(
      `${API_URL}/posts/${postId}`, 
      getAuthHeader()
    );
    return response.data;
  },

  /**
   * ৪. একটি নির্দিষ্ট পোস্টের ডিটেইলস এবং কমেন্ট দেখা
   */
  getPostById: async (postId: string) => {
    const response = await axios.get(
      `${API_URL}/posts/${postId}`,
      getAuthHeader()
    );
    return response.data;
  },

  /**
   * ৫. কমেন্ট অথবা রিপ্লাই যোগ করা
   * @param parentId - যদি এটি একটি রিপ্লাই হয়, তবে মেইন কমেন্টের ID দিন
   */
  addComment: async (postId: string, commentText: string, parentId: string | null = null) => {
    const response = await axios.post(
      `${API_URL}/comments`,
      { 
        post_id: postId, 
        comment_text: commentText,
        parent_id: parentId 
      },
      getAuthHeader()
    );
    return response.data;
  },

  /**
   * ৬. কমেন্ট ডিলিট করা
   */
  deleteComment: async (commentId: string) => {
    const response = await axios.delete(
      `${API_URL}/comments/${commentId}`, 
      getAuthHeader()
    );
    return response.data;
  },

  /**
   * ৭. রিঅ্যাক্ট (Like) টগল করা
   */
  toggleReact: async (postId: string) => {
    const response = await axios.post(
      `${API_URL}/react`,
      { post_id: postId },
      getAuthHeader()
    );
    return response.data;
  }
};