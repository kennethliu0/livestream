import { io, Socket } from "socket.io-client";
import type { Message } from "@repo/types";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ServerToClientEvents {
  message: (message: Message) => void;
}

interface ClientToServerEvents {
  message: (message: Message) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL
);

export function sendMessage(content: string, origin: string): void {
  const message: Message = {
    content,
    origin,
    timestamp: Date.now(),
  };
  socket.emit("message", message);
}

export function onMessage(callback: (message: Message) => void): void {
  socket.on("message", callback);
}

if (import.meta.env.DEV) {
  (window as any).__socket = socket;
  (window as any).__sendMessage = sendMessage;
}
