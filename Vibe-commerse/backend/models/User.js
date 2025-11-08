import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
});

export default mongoose.model("User", userSchema);
