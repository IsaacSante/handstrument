import { useEffectStore } from "../../../useEffectStore";
import { Player } from "tone";
import {
  createFeedbackDelay,
  updateFeedbackEffect,
} from "./effects/FeedbackDelay";
import { createPitchShift, updatePitchShift } from "./effects/PitchShift";
import { clamp } from "../functions/clamp";

// init song and player
const songUrl = "/afterHours.mp3";
const player = new Player(songUrl);

// Initialize the effects
let feedbackDelay = createFeedbackDelay("8n");
let pitchShift = createPitchShift();
player.disconnect().connect(feedbackDelay).connect(pitchShift).toDestination();

// Initialize previous state for comparison
let prevState = useEffectStore.getState().effects;

// Subscribe to store changes and apply effects dynamically
useEffectStore.subscribe(() => {
  const newState = useEffectStore.getState().effects;
  // Validate and update pitch shift
  if (newState.shift !== prevState.shift) {
    const clampedShift = clamp(newState.shift);
    updatePitchShift(pitchShift, clampedShift);
  }
  //  Validate and update feedback effect
  if (newState.feedback !== prevState.feedback) {
    const clampedFeedback = clamp(newState.feedback);
    updateFeedbackEffect(feedbackDelay, clampedFeedback);
  }
  prevState = newState;
});

export default function playSong() {
  // Start playing the song if not already playing
  if (player.state !== "started") {
    player.start();
  }
}
