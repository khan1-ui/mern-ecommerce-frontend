import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const Home = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, productsRes] = await Promise.all([
          api.get("/products/stats"),
          api.get("/products"),
        ]);

        setStats(statsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Home data load failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="px-6 py-10">
      {/* ================= HERO SECTION ================= */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Digital & Physical Products Marketplace
        </h1>

        <p className="text-gray-600 mb-6 dark:text-gray-300">
          Buy high-quality digital resources and modern devices from one
          trusted platform. Secure checkout, instant download and fast
          delivery.
        </p>

        {/* LIVE STATS */}
        {stats && (
          <div className="flex justify-center gap-4 mb-8 text-sm">
            <span className="border px-4 py-2 rounded">
              {stats.total}+ Products
            </span>
            <span className="border px-4 py-2 rounded">
              {stats.digital} Digital
            </span>
            <span className="border px-4 py-2 rounded">
              {stats.physical} Physical
            </span>
          </div>
        )}

        <Link
          to="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Browse Products
        </Link>
      </div>

      {/* ================= FEATURE HIGHLIGHTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 ">
        <Feature
          title="Secure Digital Download"
          desc="Access purchased digital products securely from your dashboard."
        />
        <Feature
          title="Physical Product Delivery"
          desc="Get devices delivered to your doorstep with order tracking."
        />
        <Feature
          title="Admin-Managed System"
          desc="Products, orders and users fully controlled by admin."
        />
      </div>

      {/* ================= FEATURED PRODUCTS ================= */}
      <div className="mt-20 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded hover:shadow transition"
              >
                <h3 className="font-semibold mb-1">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2 dark:text-gray-100">
                  {product.type === "digital"
                    ? "Instant Download"
                    : "Physical Delivery"}
                </p>

                <p className="font-bold mb-3">
                  ৳ {product.price}
                </p>

                <Link
                  to={`/product/${product.slug}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Feature = ({ title, desc }) => (
  <div className="border p-6 rounded hover:shadow transition">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-100">{desc}</p>
  </div>
);

export default Home;
