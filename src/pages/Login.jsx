import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Email and password are required", "error");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email, password);

      showToast("Login successful 🎉", "success");

      // 🔥 SaaS Store-based redirect
      if (user?.store) {
        navigate(`/store/${user.store}`);
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      showToast(
        err?.response?.data?.message || "Login failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="p-6 max-w-md mx-auto bg-white shadow rounded dark:bg-gray-800"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Welcome Back
      </h2>

      <input
        className="border p-2 w-full mb-4 rounded dark:bg-gray-700"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        className="border p-2 w-full mb-4 rounded dark:bg-gray-700"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
