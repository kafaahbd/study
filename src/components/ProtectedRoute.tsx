import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// children কে ? (optional) করে দেওয়া হয়েছে যেন Outlet ব্যবহার করা যায়
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // যদি children থাকে তবে সেটা দেখাবে, নাহলে রাউটের ভেতরের কম্পোনেন্ট (Outlet) দেখাবে
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;