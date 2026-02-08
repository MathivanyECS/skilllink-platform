import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black border-b border-green-500/20">
      <h1 className="text-xl font-bold">
        Skill<span className="text-primary">Link</span>
      </h1>

      <div className="space-x-4">
        <Link to="/login" className="text-gray-300 hover:text-primary">
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-primary text-black rounded"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
