import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api, { getImageUrl } from "../services/api";
import { useToast } from "../context/ToastContext";

/* ================= SORTABLE IMAGE ================= */
const SortableImage = ({ image, isMain, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div {...attributes} {...listeners}>
        <img
          src={getImageUrl(image.url)}
          className={`w-full h-24 object-cover rounded ${
            isMain ? "ring-2 ring-black" : ""
          }`}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(image)}
        className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
      >
        ✕
      </button>

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
  const { showToast } = useToast();

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
        const { data } = await api.get(
          `/store-owner/products/${id}`
        );

        setForm({
          title: data.title,
          description: data.description || "",
          price: data.price,
          type: data.type,
          stock: data.stock || "",
        });

        setExistingImages(
          (data.images || []).map((img) => ({
            id: img, // 🔥 stable id
            url: img,
          }))
        );
      } catch {
        showToast("Failed to load product", "error");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      previewNewImages.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [previewNewImages]);

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
        formData.append(k, v);
      });

      formData.append(
        "removedImages",
        JSON.stringify(removedImages)
      );

      formData.append(
        "orderedImages",
        JSON.stringify(
          existingImages.map((i) => i.url)
        )
      );

      newImages.forEach((img) =>
        formData.append("images", img)
      );

      await api.put(
        `/store-owner/products/${id}`,
        formData
      );

      showToast("Product updated", "success");
      navigate("/admin/products");
    } catch {
      showToast("Update failed", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <form
      onSubmit={submitHandler}
      className="p-6 max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold">
        Edit Product
      </h2>

      <input
        className="border p-2 w-full rounded"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        className="border p-2 w-full rounded"
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
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      {form.type === "physical" && (
        <input
          type="number"
          className="border p-2 w-full rounded"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />
      )}

      {existingImages.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={existingImages.map((i) => i.id)}
          >
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
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleNewImages}
      />

      <button className="bg-black text-white w-full py-2 rounded">
        Update Product
      </button>
    </form>
  );
};

export default EditProduct;
