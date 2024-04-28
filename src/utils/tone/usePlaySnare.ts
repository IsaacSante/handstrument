import { NoiseSynth } from "tone";

// Create a new NoiseSynth instance optimized for snare drum sounds
const snare = new NoiseSynth({
  noise: {
    type: "white", // 'white' noise generates a classic snare drum sound
  },
  envelope: {
    attack: 0.005,
    decay: 0.2,
    sustain: 0.01,
    release: 0.1,
    attackCurve: "linear",
  },
}).toDestination();

/**
 * Function to play a snare drum sound.
 * @param {string} duration - The duration for which the drum is sounded, default is "8n".
 */
export default function playSnare(duration = "8n") {
  // Trigger the attack and release of the snare drum sound
  snare.triggerAttackRelease(duration);
}
