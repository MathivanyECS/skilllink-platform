const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white flex items-center justify-center">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-green-400">SkillLink</span>
        </h1>

        <p className="text-gray-400 mb-6">
          This is your personal dashboard.  
          Here you can explore skills, collaborate with others,  
          and grow your knowledge step by step.
        </p>

        <p className="text-sm text-gray-500">
          Start learning. Start sharing. Grow together.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
