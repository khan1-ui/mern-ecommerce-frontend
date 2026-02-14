import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api"

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  console.log(cart);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/api/cart");
      setCart(data);
    } catch (error) {
      console.error("Cart fetch error", error);
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
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/api/cart/${productId}`);
    setCart(data);
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
