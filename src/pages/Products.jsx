import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await api.get("/products");
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default Products;
