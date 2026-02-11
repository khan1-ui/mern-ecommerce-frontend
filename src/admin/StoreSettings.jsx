import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

export default function StoreSettings() {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    banner: "",
    themeColor: "#000000",
  });

  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/store/${localStorage.getItem("store")}`
      );

      setForm({
        name: data.store.name,
        description: data.store.description || "",
        logo: data.store.logo || "",
        banner: data.store.banner || "",
        themeColor: data.store.themeColor || "#000000",
      });
    };

    fetchStore();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/store/settings`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showToast("Store updated successfully ✅", "success");
    } catch (err) {
      showToast("Update failed ❌", "error");
    }
  };

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">Store Settings</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Store Name"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Store Description"
      />

      <input
        type="text"
        name="logo"
        value={form.logo}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Logo URL"
      />

      <input
        type="text"
        name="banner"
        value={form.banner}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Banner URL"
      />

      <input
        type="color"
        name="themeColor"
        value={form.themeColor}
        onChange={handleChange}
        className="w-full h-10"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
