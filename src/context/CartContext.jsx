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

const addToCart = (product) => {
  setCart((prev) => {
    const existing = prev.find(
      (item) => item.productId === product._id
    );

    if (existing) {
      return prev.map((item) =>
        item.productId === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        productId: product._id,
        title: product.title,
        qty: 1,
        type: product.type,
        price: product.price,
        image: product.images?.[0] || null,
      },
    ];
  });
};


  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const updateQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const hasPhysicalProduct = cart.some(
    (item) => item.type === "physical"
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        hasPhysicalProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
