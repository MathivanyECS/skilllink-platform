import { NavLink } from "react-router-dom";

/**
 * AdminSidebar
 * - NavLink for active styling
 * - Routes are nested under /admin-dashboard/*
 */
const AdminSidebar = () => {
  const base =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition border border-transparent";
  const active = "bg-green-500/15 border-green-400/20 text-white";
  const inactive = "text-gray-300 hover:bg-white/5 hover:border-white/10";

  return (
    <aside className="w-[280px] hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="text-lg font-semibold tracking-wide">
          SkillLink <span className="text-green-400">Admin</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Platform monitoring • Safety • Analytics
        </p>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink
          to="/admin-dashboard/overview"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400/80" />
          Overview
        </NavLink>

        <NavLink
          to="/admin-dashboard/users"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400/80" />
          Users
        </NavLink>

        <NavLink
          to="/admin-dashboard/collaboration-posts"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400/80" />
          Collaboration Posts
        </NavLink>

        <NavLink
          to="/admin-dashboard/reports"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400/80" />
          Reports & Analytics
        </NavLink>

        <NavLink
          to="/admin-dashboard/system-health"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400/80" />
          System Health
        </NavLink>
      </nav>

      <div className="mt-auto p-4 border-t border-white/10">
        <div className="text-xs text-gray-400">
          Tip: Use moderation tools carefully. Actions may be irreversible.
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;