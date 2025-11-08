import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

// POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if already in cart
    let existing = await CartItem.findOne({ product: productId });
    if (existing) {
      existing.qty += qty;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = new CartItem({ product: productId, qty });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const items = await CartItem.find().populate("product");
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );
    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ message: "Error getting cart" });
  }
};

// DELETE /api/cart/:id
export const removeFromCart = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};

// PUT /api/cart/:id (optional — update quantity)
export const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    item.qty = qty;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error updating item" });
  }
};
