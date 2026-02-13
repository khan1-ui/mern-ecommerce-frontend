import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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

      // 🔥 ROLE BASED REDIRECT
     if (user.role === "superadmin") {
          navigate("/superadmin");
        } 
        else if (user.role === "storeOwner") {
          navigate("/admin");
        } 
        else if (user.role === "customer") {
          navigate("/dashboard");
        } 
        else {
          navigate("/");
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
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Welcome Back
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded text-white"
          style={{ backgroundColor: "var(--store-color)" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}
