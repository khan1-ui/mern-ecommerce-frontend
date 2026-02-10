import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (error) {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    const confirmUpdate = window.confirm(
      `Change order status to "${status}"?`
    );

    if (!confirmUpdate) return;

    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status,
      });
      showToast("Order status updated", "success");
      fetchOrders();
    } catch (error) {
      showToast("Status update failed", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white text-black
  dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">
        Manage Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders found.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded p-4"
            >
              {/* HEADER */}
              <div className="flex justify-between text-sm mb-2">
                <span>
                  <b>User:</b> {order.user?.email}
                </span>
                <span className="capitalize">
                  <b>Status:</b> {order.status}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-1 text-sm">
                {order.items.map((item, idx) => (
                  <p key={idx}>
                    • {item.product?.title} (
                    {item.type}) × {item.qty}
                  </p>
                ))}
              </div>

              {/* ADDRESS */}
              {order.deliveryAddress && (
                <div className="text-sm mt-2 text-gray-600">
                  <b>Delivery:</b>{" "}
                  {order.deliveryAddress.address},{" "}
                  {order.deliveryAddress.city}
                </div>
              )}

              {/* ACTION */}
              <div className="mt-3">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border p-2 text-sm"
                >
                  <option value="paid">
                    Paid
                  </option>
                  <option value="shipped">
                    Shipped
                  </option>
                  <option value="delivered">
                    Delivered
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
