import { useEffect, useRef, useState, useCallback } from "react";
import { useOdyssey } from "@odysseyml/odyssey/react";
import type { Message } from "@repo/types";
import { sendMessage, onMessage, onGenerated, socket } from "./utils/socket";
import "./App.css";

interface ChatEntry {
  type: "user" | "system";
  content: string;
  origin: string;
  timestamp: number;
}

function App() {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(1);
  const streamStartedRef = useRef(false);
  const lastGeneratedRef = useRef(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const odyssey = useOdyssey({
    apiKey: import.meta.env.VITE_ODDYSEY_API_KEY,
    handlers: {
      onConnected: (stream) => {
        console.log("Odyssey connected, got MediaStream");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      },
      onStreamStarted: (streamId) => {
        console.log("Odyssey stream started:", streamId);
      },
      onInteractAcknowledged: (prompt) => {
        console.log("Odyssey interaction acknowledged:", prompt);
      },
      onDisconnected: () => {
        console.log("Odyssey disconnected");
        streamStartedRef.current = false;
      },
      onStreamError: (reason, message) => {
        console.error("Odyssey stream error:", reason, message);
        streamStartedRef.current = false;
      },
    },
  });

  // Smooth countdown — drains over 5s, resets on generated or after 7s with no response
  useEffect(() => {
    const DURATION = 5000;
    const TIMEOUT = 7000;
    const id = setInterval(() => {
      const elapsed = Date.now() - lastGeneratedRef.current;
      if (elapsed >= TIMEOUT) {
        lastGeneratedRef.current = Date.now();
        setProgress(1);
      } else {
        setProgress(Math.max(0, 1 - elapsed / DURATION));
      }
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Connect to Odyssey on mount
  useEffect(() => {
    odyssey.connect().catch((err) => {
      console.error("Odyssey connect failed:", err.message);
    });
  }, []);

  // Listen for chat messages
  useEffect(() => {
    const handler = (message: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: message.content,
          origin: message.origin,
          timestamp: message.timestamp,
        },
      ]);
    };
    onMessage(handler);
    return () => {
      socket.off("message", handler);
    };
  }, []);

  // Listen for generated events → drive Odyssey
  useEffect(() => {
    const handler = (message: Message) => {
      // Reset countdown
      lastGeneratedRef.current = Date.now();

      // Show generated prompt in chat
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: message.content,
          origin: "ai",
          timestamp: message.timestamp,
        },
      ]);

      // Drive Odyssey stream
      if (!streamStartedRef.current) {
        streamStartedRef.current = true;
        odyssey
          .startStream({ prompt: message.content, portrait: false })
          .catch((err) => {
            console.error("Odyssey startStream failed:", err.message);
            streamStartedRef.current = false;
          });
      } else {
        odyssey.interact({ prompt: message.content }).catch((err) => {
          console.error("Odyssey interact failed:", err.message);
        });
      }
    };
    onGenerated(handler);
    return () => {
      socket.off("generated", handler);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text, "user");
    setInput("");
  }, [input]);

  return (
    <div className="app">
      {/* Video Panel */}
      <div className="video-panel">
        <video ref={videoRef} autoPlay playsInline muted />
        <span className={`status-indicator ${odyssey.status}`}>
          {odyssey.status}
        </span>
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="countdown-bar">
          <div
            className="countdown-fill"
            style={{ width: `${progress * 100}%` }}
          />
          <span className="countdown-label">
            Next summary in {Math.ceil(progress * 5)}s
          </span>
        </div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.type}`}>
              <span className="origin">{msg.origin}:</span>
              <span className="content">{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
