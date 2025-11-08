import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150", // fallback image
  },
  description: {
    type: String,
    default: "No description available",
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
