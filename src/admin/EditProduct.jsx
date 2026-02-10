import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../services/api";

/* ================= SORTABLE IMAGE ================= */
const SortableImage = ({ image, isMain, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative select-none"
    >
      {/* DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab"
      >
        <img
          src={`http://localhost:5000${image.url}`}
          alt=""
          className={`w-full h-24 object-cover rounded ${
            isMain ? "ring-2 ring-black" : ""
          }`}
        />
      </div>

      {/* REMOVE BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image);
        }}
        className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded hover:bg-red-600"
      >
        ✕
      </button>

      {/* MAIN BADGE */}
      {isMain && (
        <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-1 rounded">
          MAIN
        </span>
      )}
    </div>
  );
};

/* ================= MAIN ================= */
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "digital",
    stock: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [previewNewImages, setPreviewNewImages] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/admin/products/${id}`);

        setForm({
          title: data.title,
          description: data.description || "",
          price: data.price,
          type: data.type,
          stock: data.stock || "",
        });

        setExistingImages(
          (data.images || []).map((img, index) => ({
            id: `existing-${index}-${Date.now()}`,
            url: img,
          }))
        );
      } catch (err) {
        alert("Failed to load product");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  /* ================= IMAGE HANDLERS ================= */
  const removeExistingImage = (imgObj) => {
    setRemovedImages((prev) => [...prev, imgObj.url]);
    setExistingImages((prev) =>
      prev.filter((i) => i.id !== imgObj.id)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setExistingImages((items) => {
      const oldIndex = items.findIndex(
        (i) => i.id === active.id
      );
      const newIndex = items.findIndex(
        (i) => i.id === over.id
      );
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviewNewImages(
      files.map((f) => URL.createObjectURL(f))
    );
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") formData.append(k, v);
      });

      formData.append(
        "removedImages",
        JSON.stringify(removedImages)
      );

      formData.append(
        "orderedImages",
        JSON.stringify(existingImages.map((i) => i.url))
      );

      newImages.forEach((img) =>
        formData.append("images", img)
      );

      await api.put(`/admin/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated");
      navigate("/admin/products");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <form
      onSubmit={submitHandler}
      className="p-6 max-w-lg mx-auto space-y-3"
    >
      <h2 className="text-xl font-bold">Edit Product</h2>

      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        className="border p-2 w-full"
        rows="3"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      <select
        className="border p-2 w-full"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <option value="digital">Digital</option>
        <option value="physical">Physical</option>
      </select>

      {form.type === "physical" && (
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />
      )}

      {/* EXISTING IMAGES */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">
            Existing Images
            <span className="text-xs text-gray-500 ml-1">
              (drag to reorder — first is main)
            </span>
          </p>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={existingImages.map((i) => i.id)}>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((img, index) => (
                  <SortableImage
                    key={img.id}
                    image={img}
                    isMain={index === 0}
                    onRemove={removeExistingImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* NEW IMAGES */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleNewImages}
      />

      {previewNewImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previewNewImages.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      <button className="bg-black text-white w-full py-2">
        Update Product
      </button>
    </form>
  );
};

export default EditProduct;
