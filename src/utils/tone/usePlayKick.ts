import { MembraneSynth } from "tone";

const kick = new MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0.01,
    release: 1.4,
    attackCurve: "exponential",
  },
}).toDestination();

/**
 * Function to play a kick drum sound.
 * @param {string} note - The pitch of the kick drum, default is "C1".
 * @param {string} duration - The duration for which the drum is sounded, default is "8n".
 */

export default function playKick(note = "C1", duration = "8n") {
  // Trigger the attack and release of the kick drum sound
  console.log("KICK");
  kick.triggerAttackRelease(note, duration);
}
