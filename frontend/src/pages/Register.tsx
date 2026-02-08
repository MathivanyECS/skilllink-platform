import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authService";

type RegisterFormData = {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: "onChange", // ✅ real-time validation
  });

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      studentId: data.studentId,
      password: data.password,
      role: "STUDENT",
    };

    try {
      await registerUser(payload);
      setErrorMsg("");
      setSuccessMsg("Registration successful. Redirecting to login...");
      navigate("/login"); // ✅ auto redirect
    } catch (error: any) {
      setSuccessMsg("");
      if (error.response?.status === 409) {
        setErrorMsg("Account with this Email or Student ID already exists. Please login.");
      } else {
        setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/images/skilllink-logo.png"
            alt="SkillLink"
            style={{ height: "150px" }}
            className="h-14"
          />
        </div>

        <h2 className="text-xl font-bold text-center mb-6">
          Create <span className="text-green-400">Account</span>
        </h2>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Full Name */}
          <div>
            <input
              {...register("fullName", { required: "Full name is required" })}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Student ID */}
          <div>
            <input
              {...register("studentId", { required: "Student ID is required" })}
              placeholder="Student ID"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded"
            />
            {errors.studentId && (
              <p className="text-red-400 text-sm mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Email"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
                placeholder="Password"
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-400 hover:text-green-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded font-semibold ${isValid
              ? "bg-green-500 text-black hover:bg-green-400"
              : "bg-gray-600 cursor-not-allowed"
              }`}
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
