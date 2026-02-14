import { Link } from "react-router-dom";
import { getImageUrl } from "../services/api";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images?.length > 0
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : getImageUrl(product.images[0])
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div
      className="
        bg-white dark:bg-gray-800
        rounded-lg
        shadow-sm hover:shadow-md
        transition-shadow
        overflow-hidden
      "
    >
      {/* IMAGE */}
      <div className="h-44 bg-gray-100 dark:bg-gray-700">
        <Link to={`/store/${product.store.slug}/product/${product.slug}`}>
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2">
          {product.title}
        </h3>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          ৳ {product.price}
        </p>

        <Link
          to={`/store/${product.store.slug}/product/${product.slug}`}
          className="
            inline-block mt-3
            text-sm font-medium
            text-blue-600 dark:text-blue-400
            hover:underline
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
