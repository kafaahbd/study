import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/forum";

// Token local storage theke newar jonno helper
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const forumService = {
  // Shob post fetch kora (User-er category & batch onujayi auto filter hobe)
  getPosts: async () => {
    const response = await axios.get(`${API_URL}/posts`, getAuthHeader());
    return response.data;
  },

  // Noutun post toiri kora
  createPost: async (content: string, category: string, batch: string) => {
    const response = await axios.post(
      `${API_URL}/posts`,
      { content, category, batch },
      getAuthHeader()
    );
    return response.data;
  },

  // Comment add kora
  addComment: async (postId: string, commentText: string) => {
    const response = await axios.post(
      `${API_URL}/comments`,
      { post_id: postId, comment_text: commentText },
      getAuthHeader()
    );
    return response.data;
  },

  // React (Like) toggle kora
  toggleReact: async (postId: string) => {
    const response = await axios.post(
      `${API_URL}/react`,
      { post_id: postId },
      getAuthHeader()
    );
    return response.data;
  },
};