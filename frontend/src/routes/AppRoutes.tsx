import { Routes, Route } from "react-router-dom";

import GetStarted from "../pages/GetStarted";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateProfile from "../pages/CreateProfile";

import Sessions from "../pages/Sessions";
import Collaboration from "../pages/Collaboration";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* 🌍 PUBLIC ROUTES */}
    <Route path="/" element={<GetStarted />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* 🔐 PROTECTED ROUTES */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/edit-profile" element={<CreateProfile />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/collaboration" element={<Collaboration />} />
    </Route>
  </Routes>
);

export default AppRoutes;
