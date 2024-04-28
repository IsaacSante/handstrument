import { Synth } from "tone";
const synth = new Synth().toDestination();

export default function playNote(note = "C4", duration = "8n") {
  synth.triggerAttackRelease(note, duration);
}
