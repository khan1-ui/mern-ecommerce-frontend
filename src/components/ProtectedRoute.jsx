import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
