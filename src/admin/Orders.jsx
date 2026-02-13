import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
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

  const updateStatus = async (orderId, orderStatus) => {
    if (!window.confirm(`Change order status to "${orderStatus}"?`))
      return;

    try {
      setUpdatingId(orderId);

      await api.put(`/admin/orders/${orderId}/status`, {
        orderStatus,
      });

      showToast("Order status updated", "success");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, orderStatus }
            : o
        )
      );
    } catch (error) {
      showToast("Status update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 dark:text-white">
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
              className="border rounded p-4 bg-white dark:bg-gray-800 shadow-sm"
            >
              {/* HEADER */}
              <div className="flex justify-between text-sm mb-3">
                <span>
                  <b>User:</b> {order.user?.email}
                </span>

                <span className="capitalize font-semibold">
                  <b>Status:</b> {order.orderStatus}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-1 text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    • {item.product?.title} (
                    {item.product?.type}) ×{" "}
                    {item.quantity}
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              {order.shippingAddress && (
                <div className="text-sm mt-2 text-gray-500">
                  <b>Delivery:</b>{" "}
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}
                </div>
              )}

              {/* ACTION */}
              <div className="mt-3">
                <select
                  value={order.orderStatus}
                  disabled={updatingId === order._id}
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border p-2 text-sm rounded"
                >
                  <option value="pending">
                    Pending
                  </option>
                  <option value="shipped">
                    Shipped
                  </option>
                  <option value="delivered">
                    Delivered
                  </option>
                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* FOOTER */}
              <div className="text-sm mt-3 border-t pt-2 flex justify-between">
                <span>
                  Total: ৳ {order.totalAmount}
                </span>
                <span>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
