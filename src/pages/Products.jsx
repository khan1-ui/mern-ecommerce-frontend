import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loader fullScreen />;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );

  if (products.length === 0)
    return (
      <div className="text-center py-10">
        No products available.
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Marketplace Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Products;
