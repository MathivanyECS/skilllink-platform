import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/images/skilllink-logo.png";

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/85 backdrop-blur border-b border-green-500/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">

                {/* LOGO */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="SkillLink"
                        style={{ height: "200px" }}
                        className="w-auto object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                    />
                </Link>

                {/* SPACE */}
                <div className="flex-1" />

                {/* NAV */}
                <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300 mr-6">
                    <a href="#features" className="hover:text-green-400">Features</a>
                    <a href="#how-it-works" className="hover:text-green-400">How it Works</a>
                    <a href="#community" className="hover:text-green-400">Community</a>
                </nav>

                {/* LOGIN DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="px-6 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
                    >
                        Login
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-44 bg-black border border-green-500/30 rounded-lg shadow-xl overflow-hidden">
                            <Link
                                to="/login?role=user"
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                                onClick={() => setOpen(false)}
                            >
                                Student Login
                            </Link>

                            <Link
                                to="/login?role=admin"
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                                onClick={() => setOpen(false)}
                            >
                                Admin Login
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;
