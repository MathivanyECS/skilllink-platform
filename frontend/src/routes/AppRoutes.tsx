import { Routes, Route } from "react-router-dom";

import GetStarted from "../pages/GetStarted";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateProfile from "../pages/CreateProfile";

// ✅ NEW imports (added)

import Sessions from "../pages/Sessions";
import Collaboration from "../pages/Collaboration";

const AppRoutes = () => (
  <Routes>
    {/* Existing routes */}
    <Route path="/" element={<GetStarted />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/register" element={<Register />} />
    <Route path="/create-profile" element={<CreateProfile />} />
    <Route path="/sessions" element={<Sessions />} />
    <Route path="/collaboration" element={<Collaboration />} />
    <Route path="/profile" element={<CreateProfile />} />

  </Routes>
);

export default AppRoutes;
