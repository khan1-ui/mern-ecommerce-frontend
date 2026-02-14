import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      const { data } = await api.get("/api/cart");
      setCart(data || { items: [] });
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD WHEN USER CHANGES =================
  useEffect(() => {
    if (!user) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchCart();
  }, [user]);

  // ================= ADD TO CART =================
  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post("/api/cart", {
        productId,
        quantity,
      });

      setCart(data || { items: [] });
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // ================= REMOVE ITEM =================
  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/api/cart/${productId}`);
      setCart(data || { items: [] });
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  // ================= CLEAR CART (OPTIONAL) =================
  const clearCart = () => {
    setCart({ items: [] });
  };

  // ================= TOTAL CALCULATIONS =================
  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const cartTotal =
    cart?.items?.reduce(
      (acc, item) =>
        acc + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
