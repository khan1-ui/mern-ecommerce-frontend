import { useState } from "react";
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

  // ================= IMAGE HANDLERS =================
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

  // ================= SUBMIT =================
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("type", form.type);

      if (form.type === "physical") {
        formData.append("stock", form.stock);
      }

      images.forEach((img) => {
        formData.append("images", img);
      });

      if (form.type === "digital" && digitalFile) {
        formData.append("file", digitalFile);
      }

      await api.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

      <form
        onSubmit={submitHandler}
        className="space-y-3"
      >
        {/* TITLE */}
        <input
          className="border p-2 w-full"
          placeholder="Product Title"
          required
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          className="border p-2 w-full"
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

        {/* PRICE */}
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Price"
          required
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        {/* TYPE */}
        <select
          className="border p-2 w-full"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        >
          <option value="digital">
            Digital Product
          </option>
          <option value="physical">
            Physical Product
          </option>
        </select>

        {/* STOCK */}
        {form.type === "physical" && (
          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Stock Quantity"
            required
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
          />
        )}

        {/* ================= IMAGE UPLOAD ================= */}
        <div>
          <label className="text-sm font-medium">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="block mt-1"
            onChange={handleImages}
          />
        </div>

        {/* IMAGE PREVIEW GRID */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {previewImages.map((img, index) => (
              <div
                key={index}
                className="relative border rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                  className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= DIGITAL FILE ================= */}
        {form.type === "digital" && (
          <div>
            <label className="text-sm font-medium">
              Digital File
            </label>
            <input
              type="file"
              accept=".pdf,.zip,.rar"
              className="block mt-1"
              onChange={(e) =>
                setDigitalFile(e.target.files[0])
              }
              required
            />
          </div>
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full"
        >
          {loading
            ? "Saving..."
            : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
