import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function StorePage() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/store/${slug}`
      );
      setStore(data.store);
      setProducts(data.products);
    };

    fetchStore();
  }, [slug]);

  if (!store) return <div className="p-6">Loading...</div>;

  return (
    <div>
      {/* 🔥 Banner Section */}
      <div className="relative h-64">
        <img
          src={store.banner}
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">
            {store.name}
          </h1>
        </div>
      </div>

      {/* 🔥 Logo + Description */}
      <div className="text-center -mt-12 relative z-10">
        <img
          src={store.logo}
          alt="logo"
          className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow"
        />

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          {store.description || "Welcome to our store!"}
        </p>
      </div>

      {/* 🔥 Products */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
