import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";

const Login = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await loginUser(data);
      alert("Login success");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-dark to-green-900">
      <div className="relative bg-card/80 backdrop-blur-xl p-8 rounded-xl w-full max-w-md shadow-2xl border border-green-500/20">

        <h2 className="text-2xl font-bold text-center mb-6">
          Skill<span className="text-primary">Link</span> Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:outline-none focus:border-primary"
          />

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:outline-none focus:border-primary"
          />

          <button
            type="submit"
            className="w-full py-3 bg-primary text-black rounded font-semibold hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary">
            Register
          </a>
        </p>
      </div>
     </div>
  );
};

export default Login;
