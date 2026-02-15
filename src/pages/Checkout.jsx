import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

const Checkout = () => {
  const { cart, clearCart, loading } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const cartItems = cart?.items || [];

  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  /* ================= Redirect if cart empty ================= */
  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, loading, navigate]);

  const hasPhysicalProduct = cartItems.some(
    (item) => item.product?.type === "physical"
  );

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + (item.product?.price || 0) * item.quantity,
    0
  );

  /* ================= VALIDATION ================= */
  const validateAddress = () => {
    const { name, phone, address: addr, city } = address;

    if (!name.trim() || !phone.trim() || !addr.trim() || !city.trim()) {
      showToast("Delivery address required", "error");
      return false;
    }

    if (phone.length < 10) {
      showToast("Invalid phone number", "error");
      return false;
    }

    return true;
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (placing) return;

    if (cartItems.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    if (hasPhysicalProduct && !validateAddress()) return;

    try {
      setPlacing(true);

      /* 1️⃣ Create Order */
      const { data } = await api.post("/api/orders", {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: hasPhysicalProduct ? address : null,
        paymentMethod,
      });

      const orderId = data._id;

      /* 2️⃣ Stripe Payment Flow */
      if (paymentMethod === "stripe") {
        const response = await api.post(
          "/api/payment/stripe/create-session",
          { orderId }
        );

        if (!response?.data?.url) {
          throw new Error("Stripe session failed");
        }

        // ⚠️ Do NOT clear cart here (webhook will handle)
        window.location.href = response.data.url;
        return;
      }

      /* 3️⃣ COD Flow */
      await clearCart();
      showToast("Order placed successfully 🎉", "success");
      navigate("/dashboard/orders");

    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      showToast(
        error?.response?.data?.message ||
          "Something went wrong",
        "error"
      );
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

      {/* ================= ORDER SUMMARY ================= */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-3">
          Order Summary
        </h2>

        {cartItems.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between text-sm"
          >
            <div>
              <p className="font-medium">
                {item.product.title}
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                Qty: {item.quantity}
              </p>
            </div>

            <span>
              ৳ {item.product.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>৳ {totalAmount}</span>
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="space-y-6">

        {/* DELIVERY ADDRESS */}
        {hasPhysicalProduct && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-3">
              Delivery Address
            </h2>

            {["name", "phone", "address", "city"].map((field) => (
              <input
                key={field}
                className="border p-3 w-full rounded-lg"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field]}
                onChange={(e) =>
                  setAddress({ ...address, [field]: e.target.value })
                }
              />
            ))}
          </div>
        )}

        {/* PAYMENT METHOD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold border-b pb-3">
            Payment Method
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              />
              Pay with Card (Stripe)
            </label>
          </div>
        </div>

        {/* PLACE ORDER BUTTON */}
        <button
          onClick={placeOrder}
          disabled={placing}
          className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition font-semibold disabled:opacity-50"
        >
          {placing
            ? "Processing..."
            : paymentMethod === "stripe"
            ? "Proceed to Secure Payment"
            : "Place Order"}
        </button>

      </div>
    </div>
  );
};

export default Checkout;
