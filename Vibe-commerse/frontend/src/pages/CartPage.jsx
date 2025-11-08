import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import "../components/ProductsCard.css";

export default function CartPage() {
  const { cart, loading, removeFromCart, updateItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="container"><div className="loading">Loading cart...</div></div>;

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container">
        <h2>Your cart is empty 🛒</h2>
        <p>Looks like you haven't added anything yet.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Shop products</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Your Cart</h2>
      <div className="grid">
        {cart.items.map((i) => (
          <CartItem
            key={i._id}
            item={i}
            onRemove={() => removeFromCart(i._id)}
            onUpdateQty={(qty) => updateItem(i._id, qty)}
          />
        ))}
      </div>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <h3>Total: ₹{cart.total}</h3>
        <button className="btn btn-primary" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
      </div>
    </div>
  );
}
