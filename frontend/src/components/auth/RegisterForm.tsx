import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";

const LoginForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await loginUser(data);
    alert("Login successful");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("email")} placeholder="Email" className="input" />
      <input type="password" {...register("password")} placeholder="Password" className="input" />
      <button className="w-full bg-primary text-black py-3 rounded">Login</button>
    </form>
  );
};

export default LoginForm;
