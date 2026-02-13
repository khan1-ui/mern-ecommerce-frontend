import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { getImageUrl } from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

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

        const { data } = await api.get(`/store/${slug}`);

        setStore(data.store);
        setProducts(data.products);
      } catch (err) {
        setError("Store not found.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchStore();
  }, [slug]);

  if (loading) return <Loader fullScreen />;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );

  if (!store) return null;

  const themeColor = store.themeColor || "#000000";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* 🔥 Banner */}
      <div className="relative h-72">
        <img
          src={
            store.banner?.startsWith("http")
              ? store.banner
              : getImageUrl(store.banner)
          }
          alt="banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1
            className="text-4xl font-bold"
            style={{ color: themeColor }}
          >
            {store.name}
          </h1>
        </div>
      </div>

      {/* 🔥 Logo + Description */}
      <div className="text-center -mt-14 relative z-10 px-4">
        <img
          src={
            store.logo?.startsWith("http")
              ? store.logo
              : getImageUrl(store.logo)
          }
          alt="logo"
          className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
        />

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          {store.description || "Welcome to our store!"}
        </p>
      </div>

      {/* 🔥 Products */}
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
                storeSlug={store.slug} // 🔥 Important
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
