import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";

type RegisterFormData = {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
};

const Register = () => {
  const { register, handleSubmit } = useForm<RegisterFormData>();

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
      alert("Registered successfully");
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("fullName", { required: true })}
        placeholder="Full Name"
        className="input"
      />

      <input
        {...register("studentId", { required: true })}
        placeholder="Student ID"
        className="input"
      />

      <input
        {...register("email", { required: true })}
        placeholder="Email"
        className="input"
      />

      <input
        type="password"
        {...register("password", { required: true, minLength: 8 })}
        placeholder="Password"
        className="input"
      />

      <button type="submit" className="w-full py-3 bg-primary text-black rounded">
        Register
      </button>
    </form>
  );
};

export default Register;
