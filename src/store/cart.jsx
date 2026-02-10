import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((p) => p._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const hasPhysicalProduct = cartItems.some(
    (item) => item.type === "physical"
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        hasPhysicalProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
