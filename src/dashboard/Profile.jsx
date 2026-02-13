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
        "/auth/profile",
        {
          name,
          password: password || undefined,
        }
      );

      // 🔥 Update context + localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );
      setUser(data);

      showToast(
        "Profile updated successfully",
        "success"
      );

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
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        My Profile
      </h2>

      <form
        onSubmit={submitHandler}
        className="space-y-4"
      >
        <div>
          <label className="text-sm block mb-1">
            Name
          </label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1">
            Email
          </label>
          <input
            className="border p-2 w-full rounded bg-gray-100 dark:bg-gray-900"
            value={email}
            disabled
          />
        </div>

        <div>
          <label className="text-sm block mb-1">
            New Password (optional)
          </label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
