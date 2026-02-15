import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔄 Sync user data if context updates */
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { name };

      if (password.trim()) {
        if (password.length < 6) {
          showToast(
            "Password must be at least 6 characters",
            "error"
          );
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          showToast("Passwords do not match", "error");
          setLoading(false);
          return;
        }

        payload.password = password;
      }

      const { data } = await api.put(
        "/api/auth/profile",
        payload
      );

      /* 🔥 Preserve structure */
      const updatedUser = {
        ...user,
        ...data,
      };

      localStorage.setItem(
        "userInfo",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      showToast(
        "Profile updated successfully 🎉",
        "success"
      );
      setTimeout(() => {
      navigate("/dashboard");
    }, 800);

      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.log("PROFILE ERROR FULL:", err);

      showToast(
        err?.response?.data?.message ||
          "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              My Profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage your account information
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={submitHandler}
          className="space-y-6"
        >
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Name
            </label>
            <input
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-black outline-none"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Email
            </label>
            <input
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
              value={email}
              disabled
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium block mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-black outline-none"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {/* CONFIRM PASSWORD */}
          {password && (
            <div>
              <label className="text-sm font-medium block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-black outline-none"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
          >
            {loading
              ? "Saving Changes..."
              : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
