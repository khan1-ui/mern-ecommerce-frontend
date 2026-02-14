import { useEffect, useState } from "react";
import api, { getImageUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";

export default function StoreSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    banner: "",
    themeColor: "#000000",
  });

  /* ================= FETCH STORE ================= */
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get(
          `/api/store-owner/store/${user.store}`
        );

        setForm({
          name: data.store.name,
          description: data.store.description || "",
          logo: data.store.logo || "",
          banner: data.store.banner || "",
          themeColor:
            data.store.themeColor || "#000000",
        });
      } catch (err) {
        showToast("Failed to load store", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.store) {
      fetchStore();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await api.put("/api/store-owner/settings", form); 

      showToast(
        "Store updated successfully ✅",
        "success"
      );
    } catch (err) {
      showToast("Update failed ❌", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Store Settings
      </h2>

      <form
        onSubmit={submitHandler}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Store Name"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Store Description"
          rows="3"
        />

        <input
          type="text"
          name="logo"
          value={form.logo}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Logo URL"
        />

        {form.logo && (
          <img
            src={getImageUrl(form.logo)}
            className="h-16 mt-2 rounded"
          />
        )}

        <input
          type="text"
          name="banner"
          value={form.banner}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Banner URL"
        />

        {form.banner && (
          <img
            src={getImageUrl(form.banner)}
            className="h-24 mt-2 rounded w-full object-cover"
          />
        )}

        <div>
          <label className="text-sm font-medium">
            Theme Color
          </label>
          <input
            type="color"
            name="themeColor"
            value={form.themeColor}
            onChange={handleChange}
            className="w-full h-10 mt-1"
          />
        </div>

        <button className="bg-black text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
