import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    image: String,

    friends: [{user:{ type: mongoose.Schema.Types.ObjectId, ref: "User"} ,
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }}],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    fcmTokens: {
  type: [String],
  default: [],
}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema,"user");