import React from "react";

// Define the type for the props expected by the component
type PlayAudioProps = {
  onClick: () => void; // Function type for the onClick handler
};

const PlayAudio: React.FC<PlayAudioProps> = ({ onClick }) => {
  return <button onClick={onClick}>Play Audio</button>;
};

export default PlayAudio;
