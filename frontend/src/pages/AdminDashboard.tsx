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

        <p className="text-sm text-gray-500">
          Full access • System control • Platform management
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
