import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import type { Message } from "@repo/types";
import { generateMessage } from "./generate";

async function main() {
  const testMessages: Message[] = [
    { content: "hello everyone!", origin: "user1", timestamp: Date.now() },
    {
      content: "what are we building today?",
      origin: "user2",
      timestamp: Date.now(),
    },
  ];

  console.log("Sending messages:", testMessages);
  const result = await generateMessage(testMessages);
  console.log("Generated response:", result);
}

main().catch(console.error);
