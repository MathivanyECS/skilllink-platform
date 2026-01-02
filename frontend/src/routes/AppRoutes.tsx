import { Routes, Route } from "react-router-dom";

import GetStarted from "../pages/GetStarted";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateProfile from "../pages/CreateProfile";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<GetStarted />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/register" element={<Register />} />
    <Route path="/create-profile" element={<CreateProfile />} />
  </Routes>
);

export default AppRoutes;
