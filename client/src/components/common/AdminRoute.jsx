import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Checking administrator access" />
      </div>
    );
  }

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
