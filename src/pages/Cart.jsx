import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  const items = cart?.items || [];

  const total = items.reduce(
    (acc, item) =>
      acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.product?._id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.product?.title}
                  </h2>
                  <p className="text-gray-500">
                    ৳ {item.product?.price} × {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.product?._id)
                  }
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Total: ৳ {total}
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
