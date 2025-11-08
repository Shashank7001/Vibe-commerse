import Product from "../models/Product.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// POST /api/seed-products  -> create demo products if none exist
export const seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      const products = await Product.find();
      return res.json({ seeded: false, products });
    }

    const demo = [
      {
        name: "Vibe Tee",
        price: 799,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c6d0f1c5b5d3b6f7d1d9a9e6b3a2b1a",
        description: "Soft cotton tee with subtle VibeCommerce logo.",
      },
      {
        name: "Vibe Hoodie",
        price: 1999,
        image: "https://images.unsplash.com/photo-1520975917689-3c479b4b4d5d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b6c3f8e9f4b7a6e0d6f3c2b1a9e8d7c",
        description: "Cozy hoodie for chilly evenings.",
      },
      {
        name: "Vibe Cap",
        price: 499,
        image: "https://images.unsplash.com/photo-1520975917689-3c479b4b4d5d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3f6a2b1c7d5e4a9b8c6d7e5f1a2b3c4d",
        description: "Adjustable cap with embroidered logo.",
      },
      {
        name: "Vibe Sticker Pack",
        price: 199,
        image: "https://images.unsplash.com/photo-1526312426976-0b07f3b3b8d1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b8a9c6d5e4f3a2b1c0d9e8f7a6b5c4d",
        description: "Pack of 6 high-quality stickers.",
      },
    ];

    const created = await Product.insertMany(demo);
    res.status(201).json({ seeded: true, products: created });
  } catch (error) {
    console.error("Error seeding products:", error);
    res.status(500).json({ message: "Server error seeding products" });
  }
};
