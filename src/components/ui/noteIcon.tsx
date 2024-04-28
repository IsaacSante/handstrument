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

  const buttonStyle = {
    background: note === selectedNote ? "#007BFF" : "#FFFFFF",
    color: note === selectedNote ? "#FFFFFF" : "#007BFF",
    border: "2px solid #007BFF",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
    margin: "8px",
    transition: "background 0.3s ease",
    touchAction: "manipulation",
  };

  return (
    <button style={buttonStyle} onClick={handleClick}>
      {note}
    </button>
  );
};

export default NoteIcon;
