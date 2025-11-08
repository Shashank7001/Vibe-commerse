import axios from "axios";

const API = axios.create({
  baseURL: "/api", // vite proxy handles /api → http://localhost:5000/api
});

export const getProducts = () => API.get("/products");
export const getCart = () => API.get("/cart");
export const addToCart = (productId, qty = 1) => API.post("/cart", { productId, qty });
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const updateCartItem = (id, data) => API.put(`/cart/${id}`, data);
export const checkout = (data) => API.post("/checkout", data);
