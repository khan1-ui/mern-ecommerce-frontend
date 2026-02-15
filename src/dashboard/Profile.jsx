import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.put(
        "/api/auth/profile",
        {
          name,
          password: password || undefined,
        }
      );

      // ✅ Update local storage + context
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      showToast("Profile updated successfully", "success");

      setPassword("");

    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Profile update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">

        <div>
          <h2 className="text-3xl font-bold">
            My Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Update your account information
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm block mb-1 font-medium">
              Name
            </label>
            <input
              className="border dark:border-gray-700 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm block mb-1 font-medium">
              Email
            </label>
            <input
              className="border dark:border-gray-700 p-3 w-full rounded-lg bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
              value={email}
              disabled
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm block mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              className="border dark:border-gray-700 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;
