import { Routes, Route } from "react-router-dom";
import GetStarted from "../pages/GetStarted";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<GetStarted />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);

export default AppRoutes;
