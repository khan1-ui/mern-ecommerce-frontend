import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();
 
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ Add to Cart (SaaS Safe)
  const addToCart = (product) => {
    setCart((prev) => {
      // 🔥 Check store isolation
      if (
        prev.length > 0 &&
        prev[0].store !== product.store
      ) {
        alert(
          "You can only order from one store at a time."
        );
        return prev;
      }

        const existingIndex = prev.findIndex(
          (item) => item.product === product._id
        );

      if (existingIndex) {
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          product: product._id,
          name: product.title,
          qty: 1,
          type: product.type,
          price: product.price,
          image: product.images?.[0] || null,
          store: product.store, // 🔥 required
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter((item) => item.product !== productId)
    );
  };

  const updateQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product === productId
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
