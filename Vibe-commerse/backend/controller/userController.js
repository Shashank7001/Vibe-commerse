// controllers/userController.js
import User from "../models/User.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

/**
 * POST /api/users
 * Create/register a new user
 * body: { name, email }
 */
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const user = new User({ name, email, cart: [] });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error creating user" });
  }
};

/**
 * GET /api/users/:id
 * Return user (basic)
 */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

/**
 * GET /api/users/:id/cart
 * Return user's cart populated with product details + total
 */
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "cart",
      populate: { path: "product", model: "Product" },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const items = user.cart || [];
    const total = items.reduce((sum, it) => sum + (it.product?.price || 0) * it.qty, 0);
    res.json({ items, total });
  } catch (err) {
    console.error("getUserCart error:", err);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

/**
 * POST /api/users/:id/cart
 * Add { productId, qty } to user's cart.
 * - If CartItem for same product exists, increment qty.
 */
export const addToUserCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });

    const [user, product] = await Promise.all([
      User.findById(userId).populate("cart"),
      Product.findById(productId),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check existing cart item for this user
    // user.cart contains CartItem docs if populated; otherwise query
    let existingItem = await CartItem.findOne({ _id: { $in: user.cart.map(c => c._id) }, product: productId });

    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
    } else {
      const newItem = new CartItem({ product: productId, qty });
      await newItem.save();
      user.cart.push(newItem._id);
      await user.save();
      existingItem = newItem;
    }

    // return updated cart
    const populated = await User.findById(userId).populate({
      path: "cart",
      populate: { path: "product", model: "Product" },
    });
    const total = populated.cart.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
    res.status(200).json({ items: populated.cart, total });
  } catch (err) {
    console.error("addToUserCart error:", err);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

/**
 * PUT /api/users/:id/cart/:cartItemId
 * Update qty for a specific cart item that belongs to the user
 * body: { qty }
 */
export const updateUserCartItem = async (req, res) => {
  try {
    const { id: userId, cartItemId } = req.params;
    const { qty } = req.body;
    if (qty == null) return res.status(400).json({ message: "qty required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ensure cartItem belongs to user
    if (!user.cart.includes(cartItemId)) return res.status(403).json({ message: "Cart item not in user's cart" });

    const item = await CartItem.findById(cartItemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.qty = qty;
    await item.save();

    const populated = await User.findById(userId).populate({
      path: "cart",
      populate: { path: "product", model: "Product" },
    });
    const total = populated.cart.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
    res.json({ items: populated.cart, total });
  } catch (err) {
    console.error("updateUserCartItem error:", err);
    res.status(500).json({ message: "Server error updating cart item" });
  }
};

/**
 * DELETE /api/users/:id/cart/:cartItemId
 * Remove a cart item from the user's cart
 */
export const removeUserCartItem = async (req, res) => {
  try {
    const { id: userId, cartItemId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ensure ownership
    if (!user.cart.includes(cartItemId)) return res.status(403).json({ message: "Cart item not in user's cart" });

    // remove from user's cart array and delete CartItem doc
    user.cart = user.cart.filter(cId => cId.toString() !== cartItemId);
    await user.save();
    await CartItem.findByIdAndDelete(cartItemId);

    const populated = await User.findById(userId).populate({
      path: "cart",
      populate: { path: "product", model: "Product" },
    });
    const total = populated.cart.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
    res.json({ items: populated.cart, total });
  } catch (err) {
    console.error("removeUserCartItem error:", err);
    res.status(500).json({ message: "Server error removing cart item" });
  }
};

/**
 * POST /api/users/:id/cart/clear
 * Clear all cart items for user
 */
export const clearUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // delete CartItem docs
    await CartItem.deleteMany({ _id: { $in: user.cart } });

    // empty user's cart array
    user.cart = [];
    await user.save();

    res.json({ message: "Cart cleared", items: [], total: 0 });
  } catch (err) {
    console.error("clearUserCart error:", err);
    res.status(500).json({ message: "Server error clearing cart" });
  }
};
