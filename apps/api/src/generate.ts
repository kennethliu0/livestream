import OpenAI from "openai";
import type { Message } from "@repo/types";

const fireworks = new OpenAI({
  baseURL: "https://api.fireworks.ai/inference/v1",
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
          "You receive chat messages that are prompts for video generation. Combine the 1 or 2 most popular ideas into a single new prompt in your own words. Write it casually like a user would type it. No commentary, no mentioning the audience, no lists.",
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
