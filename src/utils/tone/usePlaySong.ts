import { useEffectStore } from "../../../useEffectStore";
import { Player, Analyser } from "tone";
import {
  createFeedbackDelay,
  updateFeedbackEffect,
} from "./effects/FeedbackDelay";
import { createPitchShift, updatePitchShift } from "./effects/PitchShift";
import { createReverb, updateReverbEffect } from "./effects/Reverb";
import { createTremolo, updateTremolo } from "./effects/Tremolo";

export default function playSong(analyser: Analyser) {
  const songUrl = "/afterHours.mp3";
  const player = new Player();

  player
    .load(songUrl)
    .then(() => {
      console.log("Audio buffer loaded");

      // Initialize the effects
      const feedbackDelay = createFeedbackDelay("8n");
      const pitchShift = createPitchShift();
      //const reverb = createReverb();
      //const tremolo = createTremolo();

      feedbackDelay.wet.value = 0;
      player.connect(feedbackDelay).connect(pitchShift).connect(analyser);

      let prevState = useEffectStore.getState().targets;
      useEffectStore.subscribe(() => {
        const newState = useEffectStore.getState().targets;
        updateFeedbackEffect(feedbackDelay, newState.feedback);
        updatePitchShift(pitchShift, newState.shift);
        // updateReverbEffect(reverb, newState.reverb);
        // updateTremolo(tremolo, newState.tremolo);
        prevState = newState;
      });

      if (player.state !== "started") {
        player.start();
      }
    })
    .catch((e) => {
      console.error("Error loading audio file:", e);
    });
}
