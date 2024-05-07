import { useEffectStore } from "../../../useEffectStore";
import { Player } from "tone";
import {
  createFeedbackDelay,
  updateFeedbackEffect,
} from "./effects/FeedbackDelay";
import { createPitchShift, updatePitchShift } from "./effects/PitchShift";

// init song and player
const songUrl = "/afterHours.mp3";
const player = new Player(songUrl).toDestination();

// Initialize the effects
let feedbackDelay = createFeedbackDelay("4n");
let pitchShift = createPitchShift();
player.connect(feedbackDelay).connect(pitchShift);

// Initialize previous state for comparison
let prevState = useEffectStore.getState().effects;

// Subscribe to store changes and apply effects dynamically
useEffectStore.subscribe(() => {
  const newState = useEffectStore.getState().effects;

  if (newState.feedback !== prevState.feedback) {
    updateFeedbackEffect(feedbackDelay, newState.feedback);
  }
  if (newState.shift !== prevState.shift) {
    updatePitchShift(pitchShift, newState.shift);
  }
  prevState = newState;
});

export default function playSong() {
  // Start playing the song if not already playing
  if (player.state !== "started") {
    player.start();
  }
}
