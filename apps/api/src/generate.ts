import OpenAI from "openai";
import type { Message } from "@repo/types";

const fireworks = new OpenAI({
  baseURL: "https://api.fireworks.ai/inference/v1",
  apiKey: process.env.FIREWORKS_API_KEY,
});

export async function generateMessage(messages: Message[]): Promise<Message> {
  const chatMessages = messages.map((m) => ({
    role: "user" as const,
    content: m.content,
  }));

  const completion = await fireworks.chat.completions.create({
    model: "accounts/fireworks/models/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You receive recent chat messages from a livestream. Summarize the intent of the audience under 15 words. Keep it simple—pick only the 1 or 2 strongest ideas, no extra clauses.",
      },
      ...chatMessages,
    ],
  });

  return {
    content: completion.choices[0]?.message?.content ?? "",
    origin: "server",
    timestamp: Date.now(),
  };
}
