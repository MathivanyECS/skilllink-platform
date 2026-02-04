import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await loginUser(data);
    alert("Login successful");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
