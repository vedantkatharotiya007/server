import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./config/socket.js";
import connectDB from "./config/db.js";
import createuser from "./routes/user.routes.js";
import friend from "./routes/friend.routes.js";
import chat from "./routes/chat.routes.js";
import group from "./routes/group.routes.js";
import ai from "./routes/ai.routes.js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use(express.json());

connectDB();

app.use("/api/user",createuser);
app.use("/api/friend",friend);
app.use("/api/chat",chat);
app.use("/api/group",group);
app.use("/api/chatgpt",ai)
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});