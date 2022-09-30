import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    record: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
