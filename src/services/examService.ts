import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const saveResult = async (resultData: any) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/exam/save`, resultData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getUserStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/exam/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};