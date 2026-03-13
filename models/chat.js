import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
  type: {
    type: String,
    enum: ["private", "group"],
    required: true,
  },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);