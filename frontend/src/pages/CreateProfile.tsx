import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

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

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const CreateProfile = () => {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 🔹 image states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
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

  // 🔹 load profile for edit mode
  useEffect(() => {
    api
      .get("/profiles/me")
      .then(res => {
        reset({
          department: res.data.department || "",
          yearOfStudy: res.data.yearOfStudy || 1,
          bio: res.data.bio || "",
          phoneNumber: res.data.phoneNumber || "",
          skillsToTeach: res.data.skillsToTeach?.length
            ? res.data.skillsToTeach
            : [{ skillName: "", proficiency: "BEGINNER", yearsOfExperience: 0 }],
          skillsToLearn: res.data.skillsToLearn?.length
            ? res.data.skillsToLearn
            : [""],
        });

        setExistingImage(
          res.data.profilePicture
            ? `http://localhost:8081${res.data.profilePicture}`
            : null
        );

        setIsEditMode(true);
      })
      .catch(() => {
        setIsEditMode(false);
      });
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setErrorMsg("");

    try {
      let imageUrl = existingImage;

      // 🔹 upload image if user selected one
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);

        const imgRes = await api.put(
          "/profiles/me/profile-picture",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = imgRes.data.profileImageUrl;
      }

      const payload = {
        department: data.department.trim(),
        yearOfStudy: Number(data.yearOfStudy),
        bio: data.bio.trim(),
        phoneNumber: data.phoneNumber.trim(),
        profilePicture: imageUrl,
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

      if (isEditMode) {
        await api.put("/profiles/me", payload);
      } else {
        await api.post("/profiles", payload);
      }

      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 py-16">

        <h1 className="text-3xl font-bold text-center mb-2">
          Complete Your <span className="text-green-400">Profile</span>
        </h1>

        <p className="text-center text-gray-400 mb-12">
          Tell us about yourself so we can personalize your experience.
        </p>

        {/* hidden image input */}
        <input
          type="file"
          accept="image/*"
          hidden
          id="profileImageInput"
          onChange={e => {
            if (e.target.files?.[0]) {
              setProfileImage(e.target.files[0]);
            }
          }}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="bg-black/40 p-6 rounded-2xl border border-green-500/20 space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            {/* PROFILE IMAGE */}
            <div className="flex flex-col items-center gap-3">
              <div
                onClick={() =>
                  document.getElementById("profileImageInput")?.click()
                }
                className="w-28 h-28 rounded-full border-2 border-green-400 cursor-pointer"
                style={{
                  backgroundImage: `url(${profileImage
                    ? URL.createObjectURL(profileImage)
                    : existingImage || DEFAULT_AVATAR
                    })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="text-green-400 text-sm">
                Change Photo
              </span>
            </div>

            <input
              {...register("department")}
              placeholder="Department"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg"
            />

            <input
              type="number"
              {...register("yearOfStudy")}
              placeholder="Year of Study"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg"
            />

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

          {/* RIGHT */}
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

          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </div>

          {errorMsg && (
            <p className="md:col-span-2 text-center text-red-400">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
