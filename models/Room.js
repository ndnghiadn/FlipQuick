import mongoose from "mongoose";

const RoomSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      require: true,
    },
    logs: [
      {
        type: String,
        require: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
