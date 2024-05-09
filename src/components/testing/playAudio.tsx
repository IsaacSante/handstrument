import React from "react";

// Define the type for the props expected by the component
type PlayAudioProps = {
  onClick: () => void; // Function type for the onClick handler
};

const buttonStyle = {
  background: "#FFFFFF",
  color: "#007BFF",
  border: "2px solid #007BFF",
  borderRadius: "10px",
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  outline: "none",
  margin: "4px",
  transition: "background 0.3s ease",
  touchAction: "manipulation", // Improve touch responsiveness
};

const PlayAudio: React.FC<PlayAudioProps> = ({ onClick }) => {
  return (
    <button style={buttonStyle} onClick={onClick}>
      <p>Play Audio</p>
    </button>
  );
};

export default PlayAudio;
