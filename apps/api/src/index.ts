import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import type { Message } from "@repo/types";
import { generateMessage } from "./generate";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// In-memory message buffer
let messageBuffer: Message[] = [];

// Every 5 seconds, process buffered messages and broadcast the result
setInterval(async () => {
  if (messageBuffer.length === 0) return;

  const messages = messageBuffer;
  messageBuffer = [];

  try {
    const generated = await generateMessage(messages);
    io.emit("generated", generated);
  } catch (err) {
    console.error("Failed to generate message:", err);
  }
}, 5000);

// Socket.io
io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.on("message", (message: Message) => {
    messageBuffer.push(message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
