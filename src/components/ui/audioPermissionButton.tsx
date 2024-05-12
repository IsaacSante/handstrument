import { useEffect, useRef } from "react";
type AudioPermissionButtonProps = {
  startAudio: () => void;
  btnText: string;
};

const AudioPermissionButton: React.FC<AudioPermissionButtonProps> = ({
  startAudio,
  btnText,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null); // Specify the type of ref for better type checking

  useEffect(() => {
    const button = buttonRef.current; // Store the current ref in a variable
    if (button) {
      // Check if the button is not null
      button.addEventListener("click", startAudio); // Only add the event listener if the button exists

      return () => {
        if (button) {
          // Check again when cleaning up
          button.removeEventListener("click", startAudio); // Only remove the event listener if the button exists
        }
      };
    }
  }, [startAudio]);

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
    touchAction: "manipulation",
  };

  return (
    <button ref={buttonRef} style={buttonStyle}>
      <p>{btnText}</p>
    </button>
  );
};

export default AudioPermissionButton;
