import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import type { Message } from "@repo/types";

// Load environment variables from .env
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.io
io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.on("message", (message: Message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
