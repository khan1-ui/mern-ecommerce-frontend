import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../../services/api";
import Loader from "../../components/Loader";

export default function SuperAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/superadmin/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Platform Products
      </h1>

      {products.length === 0 ? (
        <div className="text-gray-500">
          No products available.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 border-b">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Store</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  {/* PRODUCT INFO */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        product.images?.[0]?.startsWith("http")
                          ? product.images[0]
                          : getImageUrl(product.images?.[0])
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-semibold">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {product._id}
                      </div>
                    </div>
                  </td>

                  {/* STORE INFO */}
                  <td className="p-3">
                    <div className="font-medium">
                      {product.store?.name}
                    </div>
                    <Link
                      to={`/store/${product.store?.slug}`}
                      target="_blank"
                      className="text-xs text-blue-600"
                    >
                      /store/{product.store?.slug}
                    </Link>
                  </td>

                  {/* PRICE */}
                  <td className="p-3">
                    ৳ {product.price?.toLocaleString() || 0}
                  </td>

                  {/* TYPE */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.type === "digital"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {product.type || "physical"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2 flex-wrap">
                    <Link
                      to={`/store/${product.store?.slug}`}
                      target="_blank"
                      className="px-3 py-1 border rounded text-xs"
                    >
                      View Store
                    </Link>

                    {/* Future Control Buttons */}
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded">
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
