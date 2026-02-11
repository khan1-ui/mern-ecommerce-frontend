import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
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
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        form
      );

      localStorage.setItem("token", data.token);

      // 🔥 redirect to store page
      navigate(`/store/${data.store}`);

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Create Your Store
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

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

        <input
          type="text"
          name="storeName"
          placeholder="Store Name (e.g. Rahim Fashion)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Create Store
        </button>
      </form>
    </div>
  );
}
