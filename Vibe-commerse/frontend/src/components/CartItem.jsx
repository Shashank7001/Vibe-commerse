import React from "react";

export default function CartItem({ item, onRemove, onUpdateQty }) {
  const price = (item.product?.price || 0) * (item.qty || 0);

  return (
    <div className="card cart-item" style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 110 }} className="product-image">
        {item.product?.image ? (
          <img src={item.product.image} alt={item.product.name} />
        ) : (
          <div style={{ height: 80, background: "#f2f2f2", borderRadius: 6 }} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h4 className="product-title">{item.product?.name}</h4>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            <button className="btn" onClick={() => onUpdateQty(Math.max(1, item.qty - 1))}>-</button>
            <span style={{ margin: "0 8px", fontWeight: 600 }}>{item.qty}</span>
            <button className="btn" onClick={() => onUpdateQty(item.qty + 1)}>+</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>₹{price}</div>
        <button className="btn" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
