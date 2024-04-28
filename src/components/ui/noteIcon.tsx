import React from "react";

interface IProps {
  note: string;
  selectedNote: string;
  onChangeNote: (note: string) => void;
}

const NoteIcon: React.FC<IProps> = ({ note, selectedNote, onChangeNote }) => {
  const handleClick = () => {
    onChangeNote(note);
  };

  // Adding more style properties for a nicer appearance
  const buttonStyle = {
    background: note === selectedNote ? "#007BFF" : "#FFFFFF", // More visually appealing color shades
    color: note === selectedNote ? "#FFFFFF" : "#007BFF", // Ensuring the text color contrasts with the background
    border: "2px solid #007BFF",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
    margin: "5px",
    transition: "all 0.3s ease", // Smooth transition for hover effect
  };

  return (
    <button style={buttonStyle} onClick={handleClick}>
      {note}
    </button>
  );
};

export default NoteIcon;
