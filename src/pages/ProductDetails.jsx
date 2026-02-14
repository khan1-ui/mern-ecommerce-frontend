import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../services/api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const ProductDetails = () => {
  const { storeSlug, slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/api/products/store/${storeSlug}/product/${slug}`
        );

        setProduct(data);
      } catch (err) {
        console.error("PRODUCT DETAIL ERROR:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (storeSlug && slug) {
      fetchProduct();
    }
  }, [storeSlug, slug]);

  if (loading) return <Loader fullScreen />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images.map((img) =>
          img.startsWith("http") ? img : getImageUrl(img)
        )
      : ["/placeholder.png"];

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product._id, quantity);
    navigate("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* IMAGE SECTION */}
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
            className="w-full h-[380px] object-cover"
          />
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

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

        {/* Quantity Selector */}
        {product.type === "physical" && product.stock > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <span>Qty:</span>
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="border px-3"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() =>
                setQuantity((prev) =>
                  Math.min(product.stock, prev + 1)
                )
              }
              className="border px-3"
            >
              +
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <button
            disabled={
              product.type === "physical" && product.stock === 0
            }
            onClick={handleAddToCart}
            className={`px-6 py-2 rounded transition ${
              product.type === "physical" && product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {product.type === "physical" && product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          <button
            disabled={
              product.type === "physical" && product.stock === 0
            }
            onClick={handleBuyNow}
            className="px-6 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
