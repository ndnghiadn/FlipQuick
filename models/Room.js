import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    logs: [{
      type: String,
      default: ""
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
