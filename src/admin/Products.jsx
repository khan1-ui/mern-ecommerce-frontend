import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => { 
    try {
      const { data } = await api.get("/api/store-owner/products");
      setProducts(data);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setDeletingId(id);
      await api.delete(`/api/store-owner/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Product deleted successfully", "success");
    } catch (error) {
      showToast("Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Manage Products
        </h2>

        <div className="flex gap-3">
          <Link
            to="/admin/products/new"
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Product
          </Link>

          {user?.role === "storeOwner" && (
            <Link
              to="/admin/store-import"
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: "var(--store-color)" }}
            >
              Import JSON
            </Link>
          )}
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm"
            >
              {/* LEFT */}
              <div>
                <p className="font-semibold text-lg">
                  {product.title}
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span>৳ {product.price}</span>

                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      product.type === "digital"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {product.type}
                  </span>

                  {product.type === "physical" && (
                    <span>Stock: {product.stock}</span>
                  )}
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex gap-4 items-center">
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteHandler(product._id)}
                  disabled={deletingId === product._id}
                  className="text-red-600 text-sm"
                >
                  {deletingId === product._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
