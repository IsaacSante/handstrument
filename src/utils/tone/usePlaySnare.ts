import { useEffectStore } from "../../../useEffectStore";
import {
  Filter,
  FeedbackDelay,
  Reverb,
  PitchShift,
  NoiseSynth,
  Destination,
} from "tone";

// Create the effects
const feedbackDelay = new FeedbackDelay("8n", 0.5).toDestination();
const reverb = new Reverb().toDestination();
const pitchShift = new PitchShift().toDestination();

// Create a new NoiseSynth instance optimized for snare drum sounds
const snare = new NoiseSynth({
  noise: {
    type: "white",
  },
  envelope: {
    attack: 0.005,
    decay: 0.2,
    sustain: 0.01,
    release: 0.1,
    attackCurve: "linear",
  },
}).toDestination();

// Chain effects to the snare
snare.chain(feedbackDelay, reverb, pitchShift, Destination);

// Initialize previous state for comparison
let prevState = useEffectStore.getState().effects;

// Subscribe to store changes and apply effects dynamically
useEffectStore.subscribe(() => {
  const newState = useEffectStore.getState().effects;
  // Check for changes in effects and update accordingly
  if (newState.feedback !== prevState.feedback) {
    feedbackDelay.wet.value = newState.feedback;
  }
  // if (newState.reverb !== prevState.reverb) {
  //   reverb.wet.value = newState.reverb;
  // }
  // if (newState.pitchShift !== prevState.pitchShift) {
  //   pitchShift.pitch = newState.pitchShift;
  // }
  // Update prevState for the next check
  prevState = newState;
});

export default function playSnare(duration = "1n") {
  console.log("SNARE");
  snare.triggerAttackRelease(duration);
}
