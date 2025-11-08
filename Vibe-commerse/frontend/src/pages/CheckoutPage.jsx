import React, { useState } from "react";
import { checkout } from "../api/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";

export default function CheckoutPage() {
  const { cart, clearCartLocal } = useCart();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await checkout(form);
      setReceipt(res.data.receipt);
      addToast("Checkout successful!");
      clearCartLocal();
    } catch (err) {
      console.error("Checkout failed", err);
      addToast("Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Checkout</h2>

      {!receipt ? (
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: 8 }}>Total: <strong>₹{cart.total}</strong></div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Processing..." : "Pay & Checkout"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Receipt">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, color: "#16a34a" }}>✔️</div>
            <p style={{ fontWeight: 700, fontSize: 18 }}>Thank you, {receipt.name || form.name}!</p>
            <p>Total: ₹{receipt.total}</p>
            <p>Time: {new Date(receipt.timestamp).toLocaleString()}</p>

            <div style={{ textAlign: "left", marginTop: 12 }}>
              <h4>Items</h4>
              <ul>
                {receipt.items.map((it) => (
                  <li key={it._id}>{it.product.name} x {it.qty} — ₹{it.product.price * it.qty}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
