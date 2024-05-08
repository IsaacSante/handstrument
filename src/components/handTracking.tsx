// @ts-nocheck
import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import React, { useEffect, useRef, useState } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import useDetectHands from "../utils/useDetectHands";
import { HandTrackingProps } from "../types/handTracking";
import { useEffectStore } from "../../useEffectStore";

const HandTracking: React.FC<HandTrackingProps> = ({
  leftHandActive,
  rightHandActive,
  leftHandPinched,
  rightHandPinched,
  leftHandVelocity,
  rightHandVelocity,
  isMobile,
}) => {
  // References to the video and canvas HTML elements
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    console.log(videoDimensions);
  }, [videoDimensions]);

  // initiate state mapping
  const stateMapping = {
    LeftX: "lowpass",
    LeftY: "feedback",
    RightX: "reverb",
    RightY: "shift",
  };

  // update effecs in zustand store depending on what hand data is coming in
  function updateEffects(hand, x, y) {
    const { setTarget } = useEffectStore.getState();
    // fliiping hands to correct for webcam switch
    const handPrefix = hand === "Left" ? "Right" : "Left";
    // Update the effects based on the hand and flipped coordinates
    setTarget(stateMapping[`${handPrefix}X`], x);
    setTarget(stateMapping[`${handPrefix}Y`], y);
  }

  function resetHandEffects(hand) {
    const { resetValue } = useEffectStore.getState();
    const handPrefix = hand === "Left" ? "Right" : "Left";
    resetValue(stateMapping[`${handPrefix}X`]);
    resetValue(stateMapping[`${handPrefix}Y`]);
  }

  function processResults(results) {
    const foundHands = { Left: false, Right: false };

    for (let i = 0; i < results.handednesses.length; i++) {
      const handedness = results.handednesses[i];
      if (handedness.length > 0) {
        const hand = handedness[0]; // Assuming only one handedness per hand
        foundHands[hand.displayName] = true;
        getTargetCordinates(hand.displayName, results.landmarks[i]);
      }
    }

    // Reset the effects for any hand not found
    if (!foundHands.Left) {
      resetHandEffects("Left");
    }
    if (!foundHands.Right) {
      resetHandEffects("Right");
    }
  }

  // get cordinates and update them in the store
  function getTargetCordinates(hand, landmarks) {
    const targetIndex = 9;
    const targetLandmark = landmarks[targetIndex];
    if (targetLandmark) {
      const flippedX = 1 - targetLandmark.x;
      const flippedY = 1 - targetLandmark.y;
      updateEffects(hand, flippedX, flippedY);
    } else {
      console.log(`${hand} hand missing landmark data`);
    }
  }

  // pass the current time to zustand store to be able to lerp data
  useEffect(() => {
    let lastTime = Date.now();

    function animate() {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 500; // Convert ms to seconds
      lastTime = now;

      useEffectStore.getState().updateEffects(deltaTime);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile === null || isMobile === undefined) return;
    async function setupHandTracking() {
      // Resolves the necessary resources for vision tasks
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      // Creates a new HandLandmarker object with configuration for CPU-based inference
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        }
      );
      // Initializes webcam stream
      enableWebcam();
    }

    function enableWebcam() {
      // Set up webcam constraints
      const dimensions = {
        width: isMobile ? 240 : 640,
        height: isMobile ? 320 : 480,
      };

      const constraints = { video: dimensions };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            if (videoRef.current && typeof isMobile !== "undefined") {
              setVideoDimensions({
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
              });
            }
            setLoading(false);
            // Begins the webcam feed processing
            requestAnimationFrame(predictWebcam);
          });
        }
      });
    }

    async function predictWebcam() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Ensure video and canvas are properly loaded
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(predictWebcam);
        return;
      }

      if (canvas) {
        const canvasCtx = canvas.getContext("2d");
        if (canvasCtx) {
          // Set canvas size equal to video size
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Detect hand landmarks from video
          const results = await handLandmarkerRef.current?.detectForVideo(
            video,
            performance.now()
          );

          // Drawing operations
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          canvasCtx.scale(-1, 1); // Mirror the video feed
          canvasCtx.translate(-canvas.width, 0);
          canvasCtx.restore();
          // handle results
          processResults(results);
          // Request next frame processing
          requestAnimationFrame(predictWebcam);
        }
      }
    }

    // Initiate the hand tracking setup
    setupHandTracking();
  }, [isMobile]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: `${videoDimensions.width}px`,
        height: `${videoDimensions.height}px`,
      }}
    >
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            color: "rgba(33, 37, 41, 0.938)",
            fontSize: "20px",
            zIndex: 1000,
            top: 0,
            left: 0,
          }}
        >
          <p>
            Loading <br /> model...
          </p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "scaleX(-1)",
          width: "100%",
          height: "auto",
          borderRadius: "25px",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "auto",
          borderRadius: "25px",
        }}
      />
    </div>
  );
};

export default HandTracking;
