import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [accountType, setAccountType] = useState("customer");
   const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: accountType,
    };

    if (accountType === "storeOwner") {
      payload.storeName = form.storeName;
    }

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      payload
    );

    login(data);

    if (accountType === "storeOwner") {
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Registration failed"
    );
  }
};


  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Account
      </h2>

      {/* 🔥 Account Type Toggle */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setAccountType("customer")}
          className={`px-4 py-2 rounded ${
            accountType === "customer"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          Customer
        </button>

        <button
          type="button"
          onClick={() => setAccountType("storeOwner")}
          className={`px-4 py-2 rounded ${
            accountType === "storeOwner"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          Store Owner
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        {/* 🔥 Only show for Store Owner */}
        {accountType === "storeOwner" && (
          <input
            type="text"
            name="storeName"
            placeholder="Store Name (e.g. Rahim Fashion)"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          className="w-full py-2 rounded text-white"
          style={{ backgroundColor: "var(--store-color)" }}
        >
          {accountType === "storeOwner"
            ? "Create Store"
            : "Register"}
        </button>
      </form>
    </div>
  );
}
