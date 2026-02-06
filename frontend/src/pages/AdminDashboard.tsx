const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white flex items-center justify-center">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl font-bold mb-4">
          Admin <span className="text-green-400">Dashboard</span>
        </h1>

        <p className="text-gray-400 mb-6">
          Welcome, Administrator.
          You can manage users, monitor activities,
          and control the SkillLink platform from here.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          {['Overview', 'Users', 'Skills', 'Moderation', 'Notifications', 'Reports'].map((item) => (
            <div key={item} className="p-4 bg-white/5 rounded border border-white/10 hover:border-green-500 transition cursor-pointer">
              <h3 className="text-green-400 font-bold">{item}</h3>
              <p className="text-xs text-gray-500">Manage {item.toLowerCase()}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500">
          Full access • System control • Platform management
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
