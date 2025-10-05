import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: String, // Clerk user ID
  name: String,
  email: String,
  imageUrl: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
