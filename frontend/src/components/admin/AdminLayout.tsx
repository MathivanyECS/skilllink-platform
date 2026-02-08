import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

/**
 * AdminLayout
 * - Sidebar + Topbar + page content
 */
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar />

          <main className="flex-1 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>

          <footer className="border-t border-white/10 px-6 py-4 text-xs text-gray-400">
            SkillLink Admin Console • System Monitoring & Moderation
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;