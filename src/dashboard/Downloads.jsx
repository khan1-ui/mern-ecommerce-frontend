import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const { data } = await api.get("/orders/my");

        // 🔥 Filter only paid digital products
        const digitalProducts = [];

        data.forEach((order) => {
          if (order.paymentStatus === "paid") {
            order.items.forEach((item) => {
              if (item.product?.type === "digital") {
                digitalProducts.push({
                  id: item.product._id,
                  title: item.product.title,
                  orderId: order._id,
                  date: order.createdAt,
                });
              }
            });
          }
        });

        setDownloads(digitalProducts);
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            "Failed to load downloads",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [showToast]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        My Downloads
      </h1>

      {downloads.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          No digital products purchased yet.
        </p>
      ) : (
        <div className="space-y-4">
          {downloads.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="border p-4 rounded-lg bg-white dark:bg-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Purchased on{" "}
                  {new Date(
                    product.date
                  ).toLocaleDateString()}
                </p>
              </div>

              <a
                href={`${import.meta.env.VITE_API_URL}/download/${product.id}`}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
