import React, { useEffect, useRef, useState } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import detectPinch from "../utils/distanceCalculations";

import {
  HandTrackingProps,
  HandednessArray,
  Landmarks,
} from "../types/handTracking";

import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const HandTracking: React.FC<HandTrackingProps> = ({
  leftHandActive,
  rightHandActive,
  leftHandPinched,
  rightHandPinched,
}) => {
  // References to the video and canvas HTML elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Reference to the HandLandmarker instance
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
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
      const constraints = { video: true };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            if (videoRef.current) {
              setVideoDimensions({
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
              });
            }
            // Begins the webcam feed processing
            requestAnimationFrame(predictWebcam);
          });
        }
      });
    }

    // detect hand presence and which hand it is
    // delegate pinching logic
    function updateHandPresence(
      handednesses: HandednessArray,
      landmarks: Landmarks[]
    ) {
      // Temporary variables to track the presence of hands
      let foundLeftHand = false;
      let foundRightHand = false;

      // Check handedness and update refs accordingly
      // Im updating the opposite hands because the model thinks each hand is the other
      for (let i = 0; i < handednesses.length; i++) {
        const handedness = handednesses[i];
        if (handedness.length > 0) {
          const hand = handedness[0]; // Assuming only one handedness per hand
          if (hand.displayName === "Left") {
            foundRightHand = true;
            rightHandActive.current = true;
            detectPinch(landmarks[i], 8, 4, "Right", rightHandPinched);
          } else if (hand.displayName === "Right") {
            foundLeftHand = true;
            leftHandActive.current = true;
            detectPinch(landmarks[i], 8, 4, "Left", leftHandPinched);
          }
        }
      }

      // Update refs if no hand is found in the current frame
      if (!foundLeftHand) {
        leftHandActive.current = false;
      }
      if (!foundRightHand) {
        rightHandActive.current = false;
      }
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

          // Draw hand landmarks and connections if results are available
          if (results && results.landmarks) {
            //console.log(JSON.stringify(results));
            for (const landmarks of results.landmarks) {
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#FF0000",
                lineWidth: 5,
              });
              drawLandmarks(canvasCtx, landmarks, {
                color: "#F5F5DC",
                lineWidth: 2,
              });
            }
          }

          // Call the function to update hand presence and detect pinch
          updateHandPresence(results.handednesses, results.landmarks);

          canvasCtx.restore();
          // Request next frame processing
          requestAnimationFrame(predictWebcam);
        }
      }
    }

    // Initiate the hand tracking setup
    setupHandTracking();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: `${videoDimensions.width}px`,
        height: `${videoDimensions.height}px`,
      }}
    >
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
