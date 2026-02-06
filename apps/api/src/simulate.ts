import type { Server } from "socket.io";
import type { Message } from "@repo/types";

// Scene: replay of the last play
const replayPrompts = [
  "show the replay",
  "play that again",
  "I want to see the replay",
  "run it back",
  "show the last play again",
  "replay that in slow motion",
  "zoom in on the QB in the replay",
  "show the replay from the end zone",
  "one more time in slow mo",
  "replay that catch",
];

// Scene: halftime stage and performer
const halftimePrompts = [
  "show the halftime performance",
  "cut to the stage",
  "I want to see the performer",
  "show the halftime show",
  "zoom in on the stage",
  "show the main act",
  "cut to the halftime stage",
  "I want the halftime performance",
  "show the performer on stage",
  "give us the halftime show",
];

// Scene: trophy presentation and confetti celebration
const celebrationPrompts = [
  "show the trophy presentation",
  "I want to see the confetti",
  "show the MVP with the trophy",
  "cut to the trophy ceremony",
  "show the confetti and trophy",
  "I want the trophy moment",
  "show the Lombardi presentation",
  "cut to confetti and celebration",
  "show the winning team with the trophy",
  "give us the trophy and confetti",
];

// Scene: end zone / goal line camera angle
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

const demoSequence = [
  ...replayPrompts,
  ...halftimePrompts,
  ...celebrationPrompts,
  ...endZoneCamPrompts,
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

const DEMO_INTERVAL_MS = 2000;

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
