import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    hasPhysicalProduct,
  } = useCart();

  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const storeSlug = cartItems[0]?.storeSlug;

  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    navigate(`/store/${storeSlug}/checkout`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.type === "digital"
                      ? "Digital Product"
                      : "Physical Product"}
                  </p>

                  <p className="text-sm">
                    ৳ {item.price} × {item.qty}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.productId)
                  }
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Total: ৳ {total}
              </p>

              {hasPhysicalProduct && (
                <p className="text-sm text-gray-500">
                  Delivery address required
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="border px-4 py-2 rounded"
              >
                Clear Cart
              </button>

              <button
                onClick={checkoutHandler}
                className="bg-black text-white px-6 py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
