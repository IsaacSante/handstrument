// usePlaySong.js
import React, { useRef, useEffect, useState } from "react";
import { Player, Analyser } from "tone";
import { useEffectStore } from "../../../useEffectStore";
import {
  createFeedbackDelay,
  updateFeedbackEffect,
} from "./effects/FeedbackDelay";
import { createPitchShift, updatePitchShift } from "./effects/PitchShift";

const useAudioPlayer = () => {
  const initialVolume = -12;
  const playerRef = useRef<Player | null>(null);
  if (!playerRef.current) {
    playerRef.current = new Player();
    playerRef.current.volume.value = initialVolume;
  }
  return playerRef.current;
};

const usePlaySong = (analyser: Analyser, shouldPlay: boolean) => {
  const player = useAudioPlayer();

  useEffect(() => {
    const songUrl = "https://s3.amazonaws.com/isaacsante.com/million.mp3";
    player
      .load(songUrl)
      .then(() => {
        const feedbackDelay = createFeedbackDelay("8n");
        const pitchShift = createPitchShift();
        feedbackDelay.wet.value = 0;
        player.connect(feedbackDelay).connect(pitchShift).connect(analyser);

        let prevState = useEffectStore.getState().targets;
        const unsubscribe = useEffectStore.subscribe(() => {
          const newState = useEffectStore.getState().targets;
          updateFeedbackEffect(feedbackDelay, newState.feedback);
          updatePitchShift(pitchShift, newState.shift);
          prevState = newState;
        });

        return () => {
          unsubscribe();
          player.dispose();
          feedbackDelay.dispose();
          pitchShift.dispose();
        };
      })
      .catch((e) => {
        console.error("Error loading audio file:", e);
      });

    if (shouldPlay && player.state !== "started") {
      player.start();
    }

    return () => {
      if (player) {
        player.stop();
      }
    };
  }, [analyser, shouldPlay]);

  return null;
};

export default usePlaySong;
