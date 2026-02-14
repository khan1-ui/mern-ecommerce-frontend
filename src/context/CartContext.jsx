import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/api/cart"); // 🔥 no double /api
      setCart(data || { items: [] });
    } catch (error) {
      console.error("Cart fetch error", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      setLoading(false);
      return;
    }

    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    const { data } = await api.post("/api/cart", {
      productId,
      quantity: 1,
    });

    setCart(data || { items: [] });
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/api/cart/${productId}`);
    setCart(data || { items: [] });
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
