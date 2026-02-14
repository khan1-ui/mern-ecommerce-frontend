import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const cartItems = cart?.items || [];

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const hasPhysicalProduct = cartItems.some(
    (item) => item.product?.type === "physical"
  );

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    if (hasPhysicalProduct) {
      const { name, phone, address: addr, city } = address;
      if (!name || !phone || !addr || !city) {
        showToast("Delivery address required", "error");
        return;
      }
    }

    try {
      await api.post("/api/orders", {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: hasPhysicalProduct ? address : null,
      });

      showToast("Order placed successfully 🎉", "success");

      clearCart();
      navigate("/dashboard/orders");

    } catch (error) {
      showToast(
        error?.response?.data?.message || "Order failed",
        "error"
      );
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* ORDER SUMMARY */}
      <div className="border p-4 rounded mb-6">
        {cartItems.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between text-sm mb-2"
          >
            <span>
              {item.product.title} × {item.quantity}
            </span>
            <span>
              ৳ {item.product.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="border-t mt-3 pt-2 font-semibold">
          Total: ৳ {totalAmount}
        </div>
      </div>

      {/* DELIVERY ADDRESS */}
      {hasPhysicalProduct && (
        <div className="border p-4 rounded mb-6">
          <h2 className="font-semibold mb-3">
            Delivery Address
          </h2>

          <input
            className="border p-2 w-full mb-3"
            placeholder="Full Name"
            value={address.name}
            onChange={(e) =>
              setAddress({ ...address, name: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) =>
              setAddress({ ...address, phone: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="Address"
            value={address.address}
            onChange={(e) =>
              setAddress({ ...address, address: e.target.value })
            }
          />

          <input
            className="border p-2 w-full"
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />
        </div>
      )}

      <button
        onClick={placeOrder}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
