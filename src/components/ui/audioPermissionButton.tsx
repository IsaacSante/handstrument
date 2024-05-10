// @ts-nocheck
import { useEffect } from "react";
type AudioPermissionButtonProps = {
  startAudio: () => void;
};

const AudioPermissionButton: React.FC<AudioPermissionButtonProps> = ({
  startAudio,
}) => {
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
    background: "#FFFFFF",
    color: "#007BFF",
    border: "2px solid #007BFF",
    borderRadius: "10px",
    padding: "8px 20px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
    margin: "12px",
    transition: "background 0.3s ease",
    touchAction: "manipulation", // Improve touch responsiveness
  };

  return (
    <button style={buttonStyle} onClick={startAudio}>
      <p>Start Audio</p>
    </button>
  );
};

export default AudioPermissionButton;
