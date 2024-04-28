import React, { useEffect, useState } from "react";
import * as Tone from "tone";

const AudioPermissionButton: React.FC = () => {
  const [audioStarted, setAudioStarted] = useState(false);

  const startAudio = async () => {
    await Tone.start();
    console.log("audio is ready");
    setAudioStarted(true);
  };

  useEffect(() => {
    const handler = async (e: MouseEvent | TouchEvent) => startAudio();

    document.documentElement.addEventListener("mousedown", handler);
    document.documentElement.addEventListener("touchstart", handler);

    return () => {
      document.documentElement.removeEventListener("mousedown", handler);
      document.documentElement.removeEventListener("touchstart", handler);
    };
  }, []); // ensure this effect runs only once

  const buttonStyle = {
    background: audioStarted ? "#007BFF" : "#FFFFFF",
    color: audioStarted ? "#FFFFFF" : "#007BFF",
    border: "2px solid #007BFF",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
    margin: "8px",
    transition: "background 0.3s ease",
    touchAction: "manipulation", // Improve touch responsiveness
  };

  if (audioStarted) {
    // if audio has started, stop rendering the component
    return null;
  }

  return (
    <button style={buttonStyle} onClick={startAudio}>
      {audioStarted ? "Audio Enabled" : "Start Audio"}
    </button>
  );
};

export default AudioPermissionButton;
