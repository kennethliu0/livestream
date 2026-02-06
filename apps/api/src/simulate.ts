import type { Server } from "socket.io";
import type { Message } from "@repo/types";

// 1. Opening: kickoff / coin toss / first drive
const openingPrompts = [
  "show the coin toss",
  "I want to see the kickoff",
  "show the opening kickoff",
  "cut to the captains at midfield",
  "show the kick return",
  "give us the kickoff",
  "show the first drive",
  "I want the opening kick",
];

// 2. First half: in-game camera (drive / red zone)
const endZoneCamPrompts = [
  "switch to the end zone cam",
  "show the end zone angle",
  "I want the goal line view",
  "cut to the end zone camera",
  "show the view from the end zone",
  "give us the end zone cam",
  "I want to see the end zone angle",
  "switch to goal line cam",
  "show the goal line camera",
  "cut to end zone view",
];

// 3. Halftime: stage and performer
const halftimePrompts = [
  "show the halftime performance",
  "I want to see the performer",
  "show the halftime show",
  "cut to the halftime stage",
  "I want the halftime performance",
  "show the performer on stage",
  "give us the halftime show",
];

// 4. Game over: trophy and celebration
const celebrationPrompts = [
  "show the trophy presentation",
  "I want to see the confetti",
  "show the MVP with the trophy",
  "cut to the trophy ceremony",
  "show the confetti and trophy",
  "I want the trophy moment",
  "cut to confetti and celebration",
  "show the winning team with the trophy",
  "give us the trophy and confetti",
];

// Order follows normal game flow: opening → 1st half → halftime → 2nd half → celebration
const demoSequence = [
  ...openingPrompts,
  ...endZoneCamPrompts,
  ...halftimePrompts,
  ...celebrationPrompts,
];

const usernames = [
  "touchdownTom",
  "superbowl_fan",
  "couchCoach",
  "chipNdip",
  "endZoneEd",
  "halftime_hero",
  "redZoneRick",
  "blitz_betty",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const DEMO_INTERVAL_MS = 500;

export function startSimulation(io: Server, messageBuffer: Message[]) {
  let sequenceIndex = 0;

  setInterval(() => {
    const content = demoSequence[sequenceIndex % demoSequence.length]!;
    sequenceIndex += 1;

    const message: Message = {
      content,
      origin: randomItem(usernames),
      timestamp: Date.now(),
    };
    messageBuffer.push(message);
    io.emit("message", message);
  }, DEMO_INTERVAL_MS);
}
