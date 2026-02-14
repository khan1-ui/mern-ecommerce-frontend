import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

/* ================= INVOICE PREVIEW ================= */
const InvoicePreview = ({ order, onClose }) => {
  if (!order) return null;

  const downloadInvoice = async () => {
    try {
      const response = await api.get(
        `/api/invoice/orders/${order._id}/invoice`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-${order._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice download failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded space-y-4 relative shadow-xl">

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-lg"
        >
          ✕
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm text-gray-500">
            Order ID: {order._id}
          </p>
          <p className="text-sm">
            {new Date(order.createdAt).toDateString()}
          </p>
        </div>

        <hr />

        {order.shippingAddress && (
          <>
            <div>
              <p className="font-medium">Bill To</p>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
            </div>
            <hr />
          </>
        )}

        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm"
            >
              <span>
                {item.product?.title} × {item.quantity}
              </span>
              <span>
                ৳ {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <hr />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>৳ {order.totalAmount}</span>
        </div>

        <div className="text-sm space-y-1">
          <p>Payment Method: {order.paymentMethod}</p>
          <p className="capitalize">
            Status: {order.paymentStatus}
          </p>
        </div>

        <button
          onClick={downloadInvoice}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Download PDF Invoice
        </button>
      </div>
    </div>
  );
};

/* ================= MAIN ORDERS PAGE ================= */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders/my");
        setOrders(data);
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            "Failed to load orders",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showToast]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Order: {order._id.slice(-6)}
                </span>
                <span className="capitalize font-medium">
                  {order.orderStatus}
                </span>
              </div>

              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product?.title} ×{" "}
                    {item.quantity}
                  </span>

                  {item.product?.type === "digital" &&
                    order.paymentStatus ===
                      "paid" && (
                      <a
                        href={`${import.meta.env.VITE_API_URL}/api/download/${item.product?._id}`}
                        className="text-blue-600 underline"
                      >
                        Download
                      </a>
                    )}
                </div>
              ))}

              <div className="border-t mt-3 pt-2 flex justify-between text-sm items-center">
                <span>
                  ৳ {order.totalAmount}
                </span>

                <button
                  onClick={() =>
                    setSelectedOrder(order)
                  }
                  className="underline"
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <InvoicePreview
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}
    </div>
  );
};

export default Orders;
