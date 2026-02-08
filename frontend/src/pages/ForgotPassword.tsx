import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const { register, handleSubmit } = useForm();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (data: any) => {
        setMessage("");
        setError("");

        try {
            const res = await axios.post(
                `http://localhost:8081/api/auth/forgot-password?email=${data.email}`
            );

            setMessage("Reset token generated. Check your email.");
            console.log("RESET TOKEN:", res.data.token); // dev only
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md bg-white/10 p-8 rounded-xl">

                <h2 className="text-2xl font-bold mb-4 text-center">
                    Forgot Password
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        {...register("email")}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 bg-black/60 rounded-lg border border-gray-600"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-black rounded-lg font-semibold"
                    >
                        Send Reset Link
                    </button>
                </form>

                {message && <p className="text-green-400 mt-4">{message}</p>}
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
