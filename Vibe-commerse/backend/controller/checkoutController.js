import CartItem from "../models/CartItem.js";

export const checkout = async (req, res) => {
  try {
    const { name, email } = req.body;

    const items = await CartItem.find().populate("product");
    if (items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );

    const receipt = {
      name,
      email,
      total,
      timestamp: new Date(),
      items: items.map(i => ({
        product: i.product.name,
        qty: i.qty,
        price: i.product.price,
      })),
    };

    // Clear the cart after checkout
    await CartItem.deleteMany();

    res.json({
      message: "Checkout successful",
      receipt,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Error during checkout" });
  }
};
