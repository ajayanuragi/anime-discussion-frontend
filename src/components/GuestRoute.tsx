import { Navigate, Outlet } from "react-router";
import { getToken } from "@/lib/auth";

export default function GuestRoute() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}