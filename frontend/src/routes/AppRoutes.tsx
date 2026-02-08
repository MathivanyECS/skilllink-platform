import { Routes, Route } from "react-router-dom";

/* ===== PUBLIC PAGES ===== */
import GetStarted from "../pages/GetStarted";
import Login from "../pages/Login";
import Register from "../pages/Register";

/* ===== USER PAGES ===== */
import UserDashboard from "../pages/UserDashboard";
import CreateProfile from "../pages/CreateProfile";
import Sessions from "../pages/Sessions";
import Collaboration from "../pages/Collaboration";

/* ===== ADMIN LAYOUT & GUARD ===== */
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../routes/AdminDashboard";

/* ===== ADMIN PAGES ===== */
import OverviewPage from "../pages/admin/OverviewPage";
import UsersPage from "../components/admin/UsersPage";
import UserDetailsPage from "../pages/admin/UserDetailsPage";
import CollaborationPosts from "../pages/admin/CollaborationPosts";
import ReportsPage from "../pages/admin/ReportsPage";
import SystemHealthPage from "../pages/admin/SystemHealthPage";

/* ===== ROUTE GUARD ===== */
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* 🌍 PUBLIC ROUTES */}
    <Route path="/" element={<GetStarted />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* 🔐 USER PROTECTED ROUTES */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/edit-profile" element={<CreateProfile />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/collaboration" element={<Collaboration />} />
    </Route>

    {/* 🛡️ ADMIN ROUTES (SEPARATE & SAFE) */}
    <Route
      path="/admin-dashboard"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    >
      <Route index element={<OverviewPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="users/:id" element={<UserDetailsPage />} />
      <Route path="collaboration-posts" element={<CollaborationPosts />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="system-health" element={<SystemHealthPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
