import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card product-card">
      <div className="product-image">
        {product.image && <img src={product.image} alt={product.name} />}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
        <p className="product-description">{product.description}</p>
        <button className="btn btn-primary" onClick={() => onAdd(product._id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
