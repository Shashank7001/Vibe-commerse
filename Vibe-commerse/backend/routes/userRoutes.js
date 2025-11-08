import express from "express";
import { getProducts, seedProducts } from "../controller/productController.js";

const router = express.Router();

// GET /api/products
router.get("/products", getProducts);

// POST /api/seed-products -> create demo products if none exist
router.post("/seed-products", seedProducts);



import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem
} from "../controller/cartController.js";


// POST /api/cart  -> Add item
router.post("/cart", addToCart);

// GET /api/cart   -> Get cart + total
router.get("/cart", getCart);

// DELETE /api/cart/:id  -> Remove item
router.delete("/cart/:id", removeFromCart);

// (optional) PUT /api/cart/:id  -> Update quantity
router.put("/cart/:id", updateCartItem);


import { checkout } from "../controller/checkoutController.js";


// POST /api/checkout
router.post("/checkout", checkout);













import {
  createUser,
  getUser,
  getUserCart,
  addToUserCart,
  updateUserCartItem,
  removeUserCartItem,
  clearUserCart
} from "../controller/userController.js";

router.post("/", createUser);
router.get("/:id", getUser);
router.get("/:id/cart", getUserCart);
router.post("/:id/cart", addToUserCart);
router.put("/:id/cart/:cartItemId", updateUserCartItem);
router.delete("/:id/cart/:cartItemId", removeUserCartItem);
router.post("/:id/cart/clear", clearUserCart);


export default router;
