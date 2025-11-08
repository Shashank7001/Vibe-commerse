import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2, 9);
    const toast = { id, message, ...opts };
    setToasts((t) => [toast, ...t]);
    if (!opts.persistent) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 3000);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
