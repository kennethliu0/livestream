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

// 2. First half: touchdown
const touchdownPrompts = [
  "show the touchdown",
  "I want to see the touchdown",
  "show the TD run",
  "cut to the end zone for the score",
  "show the touchdown catch",
  "give us the touchdown",
  "I want the touchdown",
  "show the QB sneak for the score",
  "show the goal line touchdown",
  "cut to the touchdown",
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

// 4. Second half: big tackle
const tacklePrompts = [
  "show the tackle",
  "I want to see the hit",
  "show the big tackle",
  "cut to the sack",
  "show the linebacker tackle",
  "give us the tackle",
  "I want the big hit",
  "show the goal line stop",
  "show the tackle in the backfield",
  "cut to the tackle",
];

// 5. Game over: trophy and celebration
const celebrationPrompts = [
  "show the trophy presentation with Drake Maye",
  "I want to see the confetti",
  "show the MVP with the trophy ",
  "cut to the trophy ceremony with the Patriots",
  "show the confetti and trophy",
  "I want the trophy moment with",
  "cut to confetti and celebration with with the Patriots",
  "show the winning team with the trophy with Drake Maye",
  "give us the trophy and confetti",
];

// Order follows normal game flow: opening → touchdown → halftime → tackle → celebration
const demoSequence = [
  ...openingPrompts,
  ...touchdownPrompts,
  ...halftimePrompts,
  ...tacklePrompts,
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
