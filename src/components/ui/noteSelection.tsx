import React, { useState } from "react";
import NoteIcon from "./noteIcon";
import Section from "../layout/section";

interface IProps {
  onNoteChange: (note: string) => void;
}

const NoteSelection: React.FC<IProps> = ({ onNoteChange }) => {
  const [note, setNote] = useState("C1");

  const handleChangeNote = (newNote: string) => {
    setNote(newNote);
    onNoteChange(newNote);
  };

  return (
    <Section title="Drum Kick Note">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <NoteIcon
          note="C1"
          selectedNote={note}
          onChangeNote={handleChangeNote}
        />
        <NoteIcon
          note="C2"
          selectedNote={note}
          onChangeNote={handleChangeNote}
        />
        <NoteIcon
          note="C3"
          selectedNote={note}
          onChangeNote={handleChangeNote}
        />
      </div>
    </Section>
  );
};

export default NoteSelection;
