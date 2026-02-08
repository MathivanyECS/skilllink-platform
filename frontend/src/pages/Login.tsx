import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ✅ Get role from URL
  const role = searchParams.get("role"); // "user" | "admin"

  const onSubmit = async (data: any) => {
    setErrorMsg("");


    try {
      const res = await loginUser(data);

      const token = res.token;
      const user = res.user;
      // save token and userId
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);


      if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (!user.isProfileCompleted) {
        navigate("/create-profile");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Invalid email or password");
    }
  };


  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-black text-white">

      {/* ================= LEFT IMAGE SECTION ================= */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900">
        <img
          src="/src/assets/images/login-illustration.png"
          alt="SkillLink Login"
          className="max-w-[70%] object-contain"
        />
      </div>

      {/* ================= RIGHT LOGIN CARD ================= */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-green-500/20">

          {/* Logo / Title */}
          <div className="flex justify-center mb-6">
            <img
              src="/src/assets/images/skilllink-logo.png"
              alt="SkillLink Logo"
              style={{ height: "150px" }}
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="text-sm text-gray-300">Email</label>

              <input
                {...register("email")}
                placeholder="Enter your email"
                className={`w-full mt-1 px-4 py-3 bg-black/60 rounded-lg focus:outline-none
      ${errorMsg ? "border border-red-500" : "border border-gray-600"}
      focus:border-green-400`}
                required
              />
            </div>


            <div>
              <label className="text-sm text-gray-300">Password</label>

              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className={`w-full mt-1 px-4 py-3 bg-black/60 rounded-lg focus:outline-none
      ${errorMsg ? "border border-red-500" : "border border-gray-600"}
      focus:border-green-400`}
                required
              />
            </div>

            {errorMsg && (
              <p className="text-red-400 text-xs mt-1">
                *{errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
            >
              Sign In
            </button>
            <p className="text-sm text-right mt-2">
              <a
                href="/forgot-password"
                className="text-green-400 hover:underline"
              >
                Forgot password?
              </a>
            </p>

          </form>

          {/* ================= OR DIVIDER ================= */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          {/* ================= SOCIAL LOGIN (UI ONLY) ================= */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-600 hover:border-green-400 transition"
            >
              <img
                src="/src/assets/images/google-icon.png"
                alt="Google"
                className="w-5 h-5"
              />
            </button>

            <button
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-600 hover:border-green-400 transition"
            >
              <img
                src="/src/assets/images/facebook-icon.jpg"
                alt="Facebook"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Footer text */}
          <p className="text-sm text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-400 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;