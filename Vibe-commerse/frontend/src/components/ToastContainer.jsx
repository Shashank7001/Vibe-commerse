import React from "react";
import { useToast } from "../context/ToastContext";
import "./ToastContainer.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-root">
      {toasts.map((t) => (
        <div className="toast" key={t.id} onClick={() => removeToast(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
