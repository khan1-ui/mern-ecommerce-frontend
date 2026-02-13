import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const AddProduct = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "digital",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [digitalFile, setDigitalFile] = useState(null);

  // 🔥 Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewImages.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [previewImages]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previews);
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      showToast("Title and price required", "error");
      return;
    }

    if (form.type === "digital" && !digitalFile) {
      showToast("Digital file required", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("type", form.type);

      if (form.type === "physical") {
        formData.append("stock", Number(form.stock));
        images.forEach((img) =>
          formData.append("images", img)
        );

        await api.post(
          "/store-owner/products",
          formData
        );
      } else {
        formData.append("file", digitalFile);

        await api.post(
          "/store-owner/products/digital",
          formData
        );
      }

      showToast("Product added successfully", "success");
      navigate("/admin/products");

    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Product add failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Add New Product
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          className="border p-2 w-full rounded"
          placeholder="Product Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          required
        />

        <select
          className="border p-2 w-full rounded"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="digital">Digital</option>
          <option value="physical">Physical</option>
        </select>

        {form.type === "physical" && (
          <>
            <input
              type="number"
              className="border p-2 w-full rounded"
              placeholder="Stock Quantity"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
              required
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
            />

            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previewImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeImage(i)
                      }
                      className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {form.type === "digital" && (
          <input
            type="file"
            accept=".pdf,.zip,.rar"
            onChange={(e) =>
              setDigitalFile(e.target.files[0])
            }
            required
          />
        )}

        <button
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
