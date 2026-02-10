import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;

    // 🛡️ basic validation
    if (!name || !email || !password) {
      showToast("All fields are required", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      showToast("Account created successfully 🎉", "success");

      // small UX delay feels nicer
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={submitHandler}>
        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          disabled={loading}
        />

        <input
          className="border p-2 w-full mb-4 rounded"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          disabled={loading}
        />

        <input
          className="border p-2 w-full mb-6 rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
