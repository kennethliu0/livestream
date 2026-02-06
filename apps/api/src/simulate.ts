import type { Server } from "socket.io";
import type { Message } from "@repo/types";

const messages = [
  "make it rain",
  "rain please",
  "add some rain",
  "i want rain",
  "rain rain rain",
  "make it pour",
  "heavy rain",
  "add rain drops",
  "rainy vibes",
  "storm and rain",
  "make it snow a little",
  "add snow",
  "snow would be cool",
  "add laser eyes",
  "give him laser eyes",
  "laser eyes please",
  "ooh laser eyes",
];

const usernames = [
  "viewer42",
  "codeFan99",
  "streamLurker",
  "devNewbie",
  "techBro",
  "nightOwl",
  "curious_cat",
  "pixel_wizard",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function startSimulation(io: Server, messageBuffer: Message[]) {
  setInterval(() => {
    const message: Message = {
      content: randomItem(messages),
      origin: randomItem(usernames),
      timestamp: Date.now(),
    };
    messageBuffer.push(message);
    io.emit("message", message);
  }, 500);
}
