import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}