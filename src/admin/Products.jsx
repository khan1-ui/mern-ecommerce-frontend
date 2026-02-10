import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/admin/products");
      setProducts(data);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/products/${id}`);
      showToast("Product deleted", "success");
      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Manage Products
        </h2>

        <Link
          to="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <p className="text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded p-4 flex justify-between items-center"
            >
              {/* LEFT */}
              <div>
                <p className="font-semibold text-lg">
                  {product.title}
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>৳ {product.price}</span>

                  {/* TYPE BADGE */}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      product.type === "digital"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {product.type}
                  </span>

                  {/* STOCK */}
                  {product.type === "physical" && (
                    <span>
                      Stock: {product.stock}
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex gap-3">
                {/* FUTURE: EDIT */}
                {/* <button className="text-blue-600 text-sm">
                  Edit
                </button> */}

                <div className="flex gap-4 items-center">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
