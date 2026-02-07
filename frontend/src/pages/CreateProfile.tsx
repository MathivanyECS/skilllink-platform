import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

type SkillToTeach = {
  skillName: string;
  proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsOfExperience: number;
};

type ProfileFormData = {
  department: string;
  yearOfStudy: number;
  bio: string;
  phoneNumber: string;
  skillsToTeach: SkillToTeach[];
  skillsToLearn: string[];
};

const CreateProfile = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    defaultValues: {
      skillsToTeach: [
        { skillName: "", proficiency: "BEGINNER", yearsOfExperience: 0 },
      ],
      skillsToLearn: [""],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "skillsToTeach",
  });

  const onSubmit = async (data: ProfileFormData) => {

    setLoading(true);
    setErrorMsg("");
    try {
      const payload = {
        department: data.department.trim(),
        yearOfStudy: Number(data.yearOfStudy),
        bio: data.bio.trim(),
        phoneNumber: data.phoneNumber.trim(),
        skillsToTeach: data.skillsToTeach
          .filter(s => s.skillName.trim() !== "")
          .map(s => ({
            skillName: s.skillName.trim(),
            proficiency: s.proficiency,
            yearsOfExperience: Number(s.yearsOfExperience) || 0,
          })),
        skillsToLearn: data.skillsToLearn
          .map(s => s.trim())
          .filter(s => s !== ""),
      };
      console.log("Sending payload:", payload);
      await api.post("/profiles", payload);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Profile creation error:", err.response?.data || err);

      // Handle different error types
      if (err.response?.data?.validationErrors) {
        const validationErrors = err.response.data.validationErrors;
        const errorMessages = Object.values(validationErrors).join(", ");
        setErrorMsg(errorMessages);
      } else {
        setErrorMsg(
          err.response?.data?.message ||
          "Failed to create profile. Please check your inputs and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-16">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Complete Your <span className="text-green-400">Profile</span>
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Tell us about yourself so we can personalize your experience.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-10"
        >

          {/* LEFT CARD */}
          <div className="bg-black/40 p-6 rounded-2xl border border-green-500/20 space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            {/* Image */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-full border-2 border-green-400 flex items-center justify-center">
                <span className="text-gray-500">Profile</span>
              </div>
              <span className="text-green-400 text-sm">Change Photo</span>
            </div>

            <input
              {...register("department")}
              placeholder="Department"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg"
            />

            <select
              {...register("yearOfStudy")}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-gray-300"
            >
              <option value="">Select Year of Study</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <input
              {...register("phoneNumber")}
              placeholder="Phone Number"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg"
            />

            <textarea
              {...register("bio")}
              rows={4}
              placeholder="About Me"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg"
            />
          </div>

          {/* RIGHT CARD */}
          <div className="bg-black/40 p-6 rounded-2xl border border-green-500/20 space-y-6">

            <h2 className="text-xl font-semibold">Skills I Can Teach</h2>

            {fields.map((_, index) => (
              <div key={index} className="grid grid-cols-3 gap-3">
                <input
                  {...register(`skillsToTeach.${index}.skillName`)}
                  placeholder="Skill"
                  className="bg-black border border-gray-700 px-3 py-2 rounded"
                />

                <select
                  {...register(`skillsToTeach.${index}.proficiency`)}
                  className="bg-black border border-gray-700 px-3 py-2 rounded"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>

                <input
                  type="number"
                  {...register(`skillsToTeach.${index}.yearsOfExperience`)}
                  placeholder="Years"
                  className="bg-black border border-gray-700 px-3 py-2 rounded"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  skillName: "",
                  proficiency: "BEGINNER",
                  yearsOfExperience: 0,
                })
              }
              className="text-green-400 text-sm"
            >
              + Add Skill
            </button>

            <h2 className="text-xl font-semibold">Skills I Want to Learn</h2>

            {watch("skillsToLearn").map((_, index) => (
              <input
                key={index}
                {...register(`skillsToLearn.${index}`)}
                placeholder="Skill name"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded"
              />
            ))}

            <button
              type="button"
              onClick={() =>
                setValue("skillsToLearn", [...watch("skillsToLearn"), ""])
              }
              className="text-green-400 text-sm"
            >
              + Add Learning Goal
            </button>
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="px-12 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
            >
              Complete Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
