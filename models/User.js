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
  sessionVersion: {
    type: Number,
    default: 0,
  },
});

const User = models.User || model("User", UserSchema);
export default User;