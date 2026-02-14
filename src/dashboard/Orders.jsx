import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

/* ================= INVOICE PREVIEW ================= */
const InvoicePreview = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded space-y-4 relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm"
        >
          ✕
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm text-gray-500">
            Order ID: {order._id}
          </p>
          <p className="text-sm">
            Date: {new Date(order.createdAt).toDateString()}
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

        <div>
          <p className="font-medium mb-2">Items</p>
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

        <div className="text-sm">
          <p>Payment Method: COD</p>
          <p>
            Payment Status:{" "}
            <span className="capitalize font-medium">
              {order.paymentStatus}
            </span>
          </p>
        </div>

        {/* ✅ Correct Invoice Route */}
        <a
          href={`${import.meta.env.VITE_API_URL}/api/invoice/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-black text-white py-2 rounded"
        >
          Download PDF Invoice
        </a>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
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
        <p className="text-gray-500 dark:text-gray-300">
          You have not placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg bg-white dark:bg-gray-800"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-3 text-sm">
                <span>
                  Order ID:{" "}
                  <span className="font-mono">
                    {order._id.slice(-6)}
                  </span>
                </span>

                <span className="capitalize font-semibold">
                  {order.orderStatus}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product?.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-300">
                        {item.product?.type === "digital"
                          ? "Digital Product"
                          : "Physical Product"}{" "}
                        × {item.quantity}
                      </p>
                    </div>

                    {/* ✅ DIGITAL DOWNLOAD SAFE */}
                    {item.product?.type === "digital" &&
                      order.paymentStatus ===
                        "paid" && (
                        <a
                          href={`${import.meta.env.VITE_API_URL}/download/${item.product?._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      )}
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="border-t mt-4 pt-3 flex justify-between text-sm items-center">
                <span>
                  Total: ৳ {order.totalAmount}
                </span>

                <div className="flex items-center gap-3">
                  <span>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
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
