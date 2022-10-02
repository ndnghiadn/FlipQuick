import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    logs: [
      {
        type: String,
        default: "",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
