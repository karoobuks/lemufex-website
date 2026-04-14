import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: false,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "trainee"],
    default: "user",
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  sessionVersion: {
    type: Number,
    default: 0,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

const User = models.User || model("User", UserSchema);
export default User;