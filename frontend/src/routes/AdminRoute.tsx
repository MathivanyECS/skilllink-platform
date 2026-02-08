import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type AdminRouteProps = {
  children: React.ReactNode;
};

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return <Navigate to="/login?role=admin" replace state={{ from: location.pathname }} />;
  }

  try {
    const user = JSON.parse(userRaw);
    if (user?.role !== "ADMIN") {
      return <Navigate to="/login?role=admin" replace state={{ from: location.pathname }} />;
    }
  } catch {
    return <Navigate to="/login?role=admin" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default AdminRoute;