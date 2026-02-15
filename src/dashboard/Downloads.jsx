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
        const { data } = await api.get("/api/orders/my");

        const digitalProductsMap = new Map();

        data.forEach((order) => {
          if (order.paymentStatus === "paid") {
            order.items.forEach((item) => {
              if (item.product?.type === "digital") {
                digitalProductsMap.set(item.product._id, {
                  id: item.product._id,
                  title: item.product.title,
                  date: order.createdAt,
                });
              }
            });
          }
        });

        setDownloads(Array.from(digitalProductsMap.values()));
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

  const handleDownload = async (productId, title) => {
    try {
      const response = await api.get(
        `/api/download/${productId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.zip`; // adjust if pdf
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Download failed",
        "error"
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        My Downloads
      </h1>

      {downloads.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No digital products purchased yet.
        </div>
      ) : (
        <div className="space-y-5">
          {downloads.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 border rounded-xl p-5 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Purchased on{" "}
                  {new Date(product.date).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() =>
                  handleDownload(product.id, product.title)
                }
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
