import React, { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductsCard";
import "../components/ProductsCard.css";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAdd = async (id) => {
    const ok = await addToCart(id, 1);
    if (ok) {
      addToast("Added to cart");
    } else {
      addToast("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Our Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p._id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
