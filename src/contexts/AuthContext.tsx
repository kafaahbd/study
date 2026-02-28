import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
// ১. এখানে LogoutModal ইম্পোর্ট করতে হবে (বানাচ্ছেন যেটা)
import LogoutModal from "../components/LogoutModal"; 

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  study_level: "SSC" | "HSC";
  group: "Science" | "Arts" | "Commerce";
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  confirmLogout: () => void; // ২. নতুন ফাংশন ইন্টারফেসে যোগ হলো
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  name: string;
  email: string;
  phone: string;
  study_level: "SSC" | "HSC";
  group: "Science" | "Arts" | "Commerce";
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  
  // ৩. পপ-আপ দেখানোর জন্য স্টেট
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
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
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLogoutModalOpen(false); // লগআউট হলে মোডাল বন্ধ করে দাও
  };

  // ৪. এই ফাংশনটি পেজ থেকে কল করা হবে
  const confirmLogout = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, confirmLogout, isLoading }}>
      {children}
      
      {/* ৫. গ্লোবাল মোডাল এখানে রেন্ডার হবে */}
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