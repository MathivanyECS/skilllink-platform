import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const PasswordReset = () => {
    const { register, handleSubmit } = useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = searchParams.get("token"); // from URL

    const onSubmit = async (data: any) => {
        setError("");
        setSuccess("");

        try {
            await axios.post(
                `http://localhost:8081/api/auth/reset-password?token=${token}&newPassword=${data.password}`
            );

            setSuccess("Password reset successful. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md bg-white/10 p-8 rounded-xl">

                <h2 className="text-2xl font-bold mb-4 text-center">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <input
                        type="password"
                        {...register("password")}
                        placeholder="New password"
                        required
                        className="w-full px-4 py-3 bg-black/60 rounded-lg border border-gray-600"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-black rounded-lg font-semibold"
                    >
                        Reset Password
                    </button>
                </form>

                {success && <p className="text-green-400 mt-4">{success}</p>}
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default PasswordReset;
