import { useEffect, useRef, useState } from 'react';
import { useOdyssey } from '@odysseyml/odyssey/react';
import './App.css';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prompt, setPrompt] = useState('');

  const apiKey = import.meta.env.VITE_ODYSSEY_API_KEY ?? '';

  const odyssey = useOdyssey({
    apiKey,
    handlers: {
      onConnected: (mediaStream: MediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      },
      onDisconnected: () => {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      },
      onError: (error: { message: string }, fatal: boolean) => {
        console.error('Error:', error.message, 'Fatal:', fatal);
      },
      onStreamStarted: (streamId: string) => {
        console.log('Stream started:', streamId);
      },
      onInteractAcknowledged: (ackPrompt: string) => {
        console.log('Interaction acknowledged:', ackPrompt);
      },
      onStreamError: (reason: string, message: string) => {
        console.error('Stream error:', reason, message);
      },
    },
  });

  useEffect(() => {
    odyssey.connect()
      .then((stream: { id: string }) => console.log('Connected with stream:', stream.id))
      .catch((err: { message: string }) => console.error('Connection failed:', err.message));
    return () => odyssey.disconnect();
  }, []);

  const handleStart = async () => {
    await odyssey.startStream({ prompt: 'A cat at sunset', portrait: true });
  };

  const handleInteract = async () => {
    if (prompt.trim()) {
      await odyssey.interact({ prompt });
      setPrompt('');
    }
  };

  const handleEnd = async () => {
    await odyssey.endStream();
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />

      <div>
        <p>Status: {odyssey.status}</p>
        {odyssey.error && <p style={{ color: 'red' }}>{odyssey.error}</p>}
      </div>

      <div>
        <button onClick={handleStart} disabled={!odyssey.isConnected}>
          Start Stream
        </button>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter interaction prompt..."
        />
        <button onClick={handleInteract} disabled={!odyssey.isConnected}>
          Send
        </button>

        <button onClick={handleEnd} disabled={!odyssey.isConnected}>
          End Stream
        </button>
      </div>
    </div>
  );
}

export default App;
