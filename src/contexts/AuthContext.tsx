import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import LogoutModal from "../components/LogoutModal"; 

// ১. User ইন্টারফেসে exam_year যোগ করা হয়েছে
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  study_level: "SSC" | "HSC";
  group: "Science" | "Arts" | "Commerce";
  exam_year?: string; // ঐচ্ছিক ফিল্ড
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<any>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  logout: () => void;
  confirmLogout: () => void;
  isLoading: boolean;
}

// ২. RegisterData ইন্টারফেসে exam_year যোগ করা হয়েছে
interface RegisterData {
  username: string;
  name: string;
  email: string;
  phone: string;
  study_level: "SSC" | "HSC";
  group: "Science" | "Arts" | "Commerce";
  password: string;
  exam_year?: string; // ঐচ্ছিক ফিল্ড
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // API Instance: বারবার হেডার সেট করা থেকে মুক্তি পেতে
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
    instance.interceptors.request.use((config) => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });
    return instance;
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Profile fetch failed:", error);
      logout();
    }
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        identifier,
        password,
      });
      const { token, user: loggedInUser } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(loggedInUser);
    } catch (error: any) {
      if (error.response?.data) throw error.response.data;
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) throw error.response.data;
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== প্রোফাইল আপডেট ফাংশন ====================
  const updateUser = async (updatedData: Partial<User>) => {
    setIsLoading(true);
    try {
      // ব্যাকএন্ডের PUT /auth/update-profile রাউটে ডাটা পাঠানো
      const response = await api.put("/auth/update-profile", updatedData);
      
      // যদি ব্যাকএন্ড আপডেট হওয়া ইউজার অবজেক্ট পাঠায়, তবে সেটি সেট করা
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        // ব্যাকএন্ডে শুধু মেসেজ পাঠালে ফ্রন্টএন্ড স্টেট মার্জ করা
        setUser(prev => prev ? { ...prev, ...updatedData } : null);
      }
    } catch (error: any) {
      if (error.response?.data) throw error.response.data;
      throw new Error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      updateUser, 
      logout, 
      confirmLogout, 
      isLoading 
    }}>
      {children}
      
      {/* গ্লোবাল লগআউট কনফার্মেশন মোডাল */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={logout} 
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};