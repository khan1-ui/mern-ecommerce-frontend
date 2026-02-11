import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function StorePage() {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/store/${slug}`
        );

        setStore(data.store);
        setProducts(data.products);
      } catch (err) {
        setError("Store not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStore();
    }
  }, [slug]);

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading store...
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!store) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* 🔥 Banner Section */}
      <div className="relative h-72">
        <img
          src={store.banner || "https://via.placeholder.com/1200x400"}
          alt="banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1
            className="text-4xl font-bold"
            style={{ color: store.themeColor || "#ffffff" }}
          >
            {store.name}
          </h1>
        </div>
      </div>

      {/* 🔥 Logo + Description */}
      <div className="text-center -mt-14 relative z-10 px-4">
        <img
          src={
            store.logo ||
            "https://via.placeholder.com/150?text=Logo"
          }
          alt="logo"
          className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
        />

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          {store.description || "Welcome to our store!"}
        </p>
      </div>

      {/* 🔥 Products Section */}
      <div className="p-6 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
