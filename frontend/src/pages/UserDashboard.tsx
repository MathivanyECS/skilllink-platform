import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white">

      {/* ===== TOP BAR ===== */}
      <div className="flex justify-end items-center px-6 py-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/edit-profile")}
        >
          <img
            src="/src/assets/images/default-avatar.png" // later replace with DB image
            alt="Profile"
            className="w-10 h-10 rounded-full border border-green-400"
          />
          <span className="text-sm text-gray-300 hover:text-green-400">
            Edit Profile
          </span>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex items-center justify-center h-[80vh]">
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
    </div>
  );
};

export default UserDashboard;
