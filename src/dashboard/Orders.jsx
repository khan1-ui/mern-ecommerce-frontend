import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import logo from "../assets/logo.png";
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl p-8 rounded-2xl shadow-2xl relative space-y-6">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="space-y-1">
             <img
                src={logo}
                alt="Store Logo"
                className="h-12"
              />
            
            <p className="text-sm text-gray-500">
              {order.store?.name}
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold tracking-wide">
              INVOICE
            </h2>
            <p className="text-sm text-gray-500">
              #{order._id.slice(-6)}
            </p>
            <p className="text-sm">
              {new Date(order.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* BILL TO */}
        {order.shippingAddress && (
          <div>
            <h3 className="font-semibold mb-2">Bill To</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
            </div>
          </div>
        )}

        {/* ITEMS TABLE */}
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-800 text-sm font-semibold p-3">
            <span>Product</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Subtotal</span>
          </div>

          {order.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-3 text-sm p-3 border-t"
            >
              <span>{item.product?.title}</span>
              <span className="text-center">{item.quantity}</span>
              <span className="text-right">
                ৳ {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-semibold border-t pt-4">
          <span>Total</span>
          <span>৳ {order.totalAmount}</span>
        </div>

        {/* PAYMENT */}
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>Payment Method: {order.paymentMethod}</p>
          <p className="capitalize">
            Status: {order.paymentStatus}
          </p>
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={downloadInvoice}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium"
        >
          Download PDF Invoice
        </button>

        <p className="text-center text-xs text-gray-400">
          Thank you for shopping with us 🤍
        </p>
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
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-3"
            >
              <div className="flex justify-between text-sm">
                <span>
                  Order #{order._id.slice(-6)}
                </span>
                <span className="capitalize font-semibold">
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
                </div>
              ))}

              <div className="flex justify-between pt-3 border-t text-sm">
                <span>
                  ৳ {order.totalAmount}
                </span>

                <button
                  onClick={() =>
                    setSelectedOrder(order)
                  }
                  className="text-blue-600 underline"
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
