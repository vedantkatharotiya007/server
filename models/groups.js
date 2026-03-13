import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatid: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);