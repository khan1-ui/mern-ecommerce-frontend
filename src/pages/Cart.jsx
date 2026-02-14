import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, loading } = useCart();

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  const total = cart?.items?.reduce(
    (acc, item) =>
      acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>

      {!cart?.items || cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              key={item.product?._id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h2 className="font-semibold">
                  {item.product?.title}
                </h2>
                <p>${item.product?.price}</p>
              </div>

              <button
                onClick={() =>
                  removeFromCart(item.product?._id)
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right font-bold">
            Total: ${total}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
