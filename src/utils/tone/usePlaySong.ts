import { useEffectStore } from "../../../useEffectStore";
import { Player } from "tone";
import {
  createFeedbackDelay,
  updateFeedbackEffect,
} from "./effects/FeedbackDelay";
import { createPitchShift, updatePitchShift } from "./effects/PitchShift";
import { createReverb, updateReverbEffect } from "./effects/Reverb";
// init song and player
const songUrl = "/afterHours.mp3";
const player = new Player(songUrl);

// Initialize the effects
const feedbackDelay = createFeedbackDelay("8n");
const pitchShift = createPitchShift();
const reverb = createReverb();
player
  .disconnect()
  .connect(pitchShift)
  .connect(reverb)
  .connect(feedbackDelay)
  .toDestination();

// Initialize previous state for comparison
let prevState = useEffectStore.getState().effects;

// Subscribe to store changes and apply effects dynamically
useEffectStore.subscribe(() => {
  const newState = useEffectStore.getState().effects;
  // Validate and update pitch shift
  if (newState.shift !== prevState.shift) {
    updatePitchShift(pitchShift, newState.shift);
  }
  //  Validate and update feedback effect
  if (newState.feedback !== prevState.feedback) {
    updateFeedbackEffect(feedbackDelay, newState.feedback);
  }
  if (newState.reverb !== prevState.reverb) {
    updateReverbEffect(reverb, newState.reverb);
  }
  prevState = newState;
});

export default function playSong() {
  // Start playing the song if not already playing
  if (player.state !== "started") {
    player.start();
  }
}
