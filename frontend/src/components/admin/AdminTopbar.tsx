import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminTopbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const title = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/overview")) return "Overview";
    if (path.includes("/users/")) return "User Details";
    if (path.includes("/users")) return "User Management";
    if (path.includes("/collaboration-posts")) return "Collaboration Moderation";
    if (path.includes("/reports")) return "Reports & Analytics";
    if (path.includes("/system-health")) return "System Health";
    return "Admin Console";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
navigate("/", { replace: true });  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/35 backdrop-blur">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-gray-400">
            Platform-level control, monitoring, analytics and moderation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-3 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition"
          >
            Admin Console
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;