import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import { getImageUrl } from "../services/api";

const ProductDetails = () => {
  const { storeSlug, productSlug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(
          `/store/${storeSlug}/product/${productSlug}`
        );
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [storeSlug, productSlug]);

  if (loading) return <Loader fullScreen />;
  if (!product) return <p className="p-6">Product not found</p>;

  const images =
    product.images?.length > 0
      ? product.images.map((img) =>
          img.startsWith("http")
            ? img
            : getImageUrl(img)
        )
      : ["/placeholder.png"];

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

      {/* IMAGE GALLERY */}
      <div className="flex gap-4">
        <div className="flex md:flex-col gap-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumbnail"
              onClick={() => setActiveImage(index)}
              className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                activeImage === index
                  ? "border-black dark:border-white"
                  : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 border rounded overflow-hidden bg-white dark:bg-gray-900">
          <img
            src={images[activeImage]}
            alt={product.title}
            className="w-full h-[380px] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div>
        <h1 className="text-2xl font-bold mb-2">
          {product.title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {product.description}
        </p>

        <p className="text-xl font-semibold mb-3">
          ৳ {product.price}
        </p>

        {product.type === "physical" && (
          <p className="text-sm mb-4">
            In stock: {product.stock}
          </p>
        )}

        <button
          onClick={() => addToCart(product)}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
