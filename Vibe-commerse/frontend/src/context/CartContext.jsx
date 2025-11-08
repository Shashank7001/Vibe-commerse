import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.getCart();
      setCart(res.data);
      // persist a shallow copy as a fallback
      try {
        localStorage.setItem("vibe_cart", JSON.stringify(res.data));
      } catch {}
    } catch (err) {
      console.error("Failed to load cart, using local fallback", err);
      const cached = localStorage.getItem("vibe_cart");
      if (cached) setCart(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId, qty = 1) => {
    setLoading(true);
    try {
      await api.addToCart(productId, qty);
      await loadCart();
      return true;
    } catch (err) {
      console.error("addToCart error", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    setLoading(true);
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (err) {
      console.error("removeFromCart error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, qty) => {
    setLoading(true);
    try {
      await api.updateCartItem(id, { qty });
      await loadCart();
    } catch (err) {
      console.error("updateItem error", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCartLocal = () => {
    try {
      localStorage.removeItem("vibe_cart");
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, loadCart, addToCart, removeFromCart, updateItem, clearCartLocal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
