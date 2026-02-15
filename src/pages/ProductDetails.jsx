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
  const [adding, setAdding] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/api/products/store/${storeSlug}/product/${slug}`
        );

        setProduct(data);
        setQuantity(1);
        setActiveImage(0);

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
  if (error)
    return (
      <div className="p-10 text-center text-red-500 text-lg">
        {error}
      </div>
    );
  if (!product) return null;

  /* ================= IMAGES ================= */
  const images =
    product.images?.length > 0
      ? product.images.map((img) =>
          img.startsWith("http") ? img : getImageUrl(img)
        )
      : ["/placeholder.png"];

  /* ================= HANDLERS ================= */
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now failed");
    } finally {
      setAdding(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-12">

      {/* ================= IMAGE SECTION ================= */}
      <div className="flex gap-4">
        <div className="flex md:flex-col gap-3">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumbnail"
              onClick={() => setActiveImage(index)}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border transition ${
                activeImage === index
                  ? "border-black dark:border-white"
                  : "opacity-60 hover:opacity-100"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 rounded-xl overflow-hidden border bg-white dark:bg-gray-900">
          <img
            src={images[activeImage]}
            alt={product.title}
            className="w-full h-[420px] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* ================= DETAILS SECTION ================= */}
      <div className="space-y-5">

        <h1 className="text-3xl font-bold">
          {product.title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          {product.description}
        </p>

        <div className="text-2xl font-semibold">
          ৳ {product.price}
        </div>

        {product.type === "physical" && (
          <p className="text-sm text-gray-500">
            In stock: {product.stock}
          </p>
        )}

        {/* ================= QUANTITY ================= */}
        {product.type === "physical" && product.stock > 0 && (
          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium">Qty:</span>

            <button
              onClick={() =>
                setQuantity((prev) => Math.max(1, prev - 1))
              }
              className="border px-4 py-1 rounded"
            >
              -
            </button>

            <span className="font-semibold text-lg">
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity((prev) =>
                  Math.min(product.stock, prev + 1)
                )
              }
              className="border px-4 py-1 rounded"
            >
              +
            </button>
          </div>
        )}

        {/* ================= BUTTONS ================= */}
        <div className="flex gap-4 pt-4">

          <button
            disabled={
              adding ||
              (product.type === "physical" &&
                product.stock === 0)
            }
            onClick={handleAddToCart}
            className={`px-8 py-3 rounded-xl font-medium transition ${
              product.type === "physical" &&
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {adding
              ? "Adding..."
              : product.type === "physical" &&
                product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          <button
            disabled={
              adding ||
              (product.type === "physical" &&
                product.stock === 0)
            }
            onClick={handleBuyNow}
            className="px-8 py-3 rounded-xl border font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Buy Now
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
