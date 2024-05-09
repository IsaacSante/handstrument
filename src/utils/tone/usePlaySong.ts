import { useEffectStore } from "../../../useEffectStore";
import { Player, Analyser } from "tone";
import {
  createFeedbackDelay,
  updateFeedbackEffect,
} from "./effects/FeedbackDelay";
import { createPitchShift, updatePitchShift } from "./effects/PitchShift";
import { createReverb, updateReverbEffect } from "./effects/Reverb";
import { createTremolo, updateTremolo } from "./effects/Tremolo";
// init song and player
const songUrl = "/afterHours.mp3";
const player = new Player(songUrl);

// Initialize the effects
const feedbackDelay = createFeedbackDelay("8n");
feedbackDelay.wet.value = 0;

const pitchShift = createPitchShift();
const reverb = createReverb();
const tremolo = createTremolo();
player.connect(feedbackDelay).connect(pitchShift);
// .connect(tremolo)
// .connect(reverb)

// Initialize previous state for comparison
let prevState = useEffectStore.getState().targets;

// Subscribe to store changes and apply effects dynamically
useEffectStore.subscribe(() => {
  const newState = useEffectStore.getState().targets;
  if (newState.shift !== prevState.shift) {
    updatePitchShift(pitchShift, newState.shift);
  }
  if (newState.feedback !== prevState.feedback) {
    updateFeedbackEffect(feedbackDelay, newState.feedback);
  }
  // if (newState.reverb !== prevState.reverb) {
  //   updateReverbEffect(reverb, newState.reverb);
  // }
  // if (newState.tremolo !== prevState.tremolo) {
  //   updateTremolo(tremolo, newState.tremolo);
  // }
  prevState = newState;
});

export default function playSong() {
  // Start playing the song if not already playing
  if (player.state !== "started") {
    player.start();
  }
}
