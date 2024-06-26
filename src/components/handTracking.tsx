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
import { getPowerOfSignalAndUpdateStore } from "../utils/tone/getRms";

const HandTracking: React.FC<HandTrackingProps> = ({
  analyser,
  isMobile,
  isAnimating,
}) => {
  // References to the video and canvas HTML elements
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewVideoRef = useRef(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    console.log(videoDimensions);
  }, [videoDimensions]);

  useEffect(() => {
    if (!isAnimating) {
      const previewConstraints = {
        video: { width: isMobile ? 120 : 160, height: isMobile ? 160 : 120 },
      };
      navigator.mediaDevices
        .getUserMedia(previewConstraints)
        .then((stream) => {
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Stream error:", error));

      return () => {
        // Clean up the stream when the component unmounts or isAnimating changes
        if (previewVideoRef.current && previewVideoRef.current.srcObject) {
          const tracks = previewVideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
          previewVideoRef.current.srcObject = null;
        }
      };
    }
  }, [isMobile, isAnimating]);

  function map(value, x1, y1, x2, y2) {
    return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
  }

  const isAnimatingRef = useRef(isAnimating);

  useEffect(() => {
    isAnimatingRef.current = isAnimating; // Update the ref to the current value
  }, [isAnimating]);

  function drawOnCanvas(ctx, canvas, video) {
    const { targets } = useEffectStore.getState(); // Access the current state

    ctx.save();
    ctx.scale(-1, 1); // Flipping the canvas horizontally
    ctx.translate(-canvas.width, 0); // Adjust for the flipped scale
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const newLeftX = targets.shift * canvas.width;
    const newRightX = targets.tremolo;
    const newLeftY = targets.feedback * canvas.height;
    const newRightY = targets.reverb * canvas.height;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const newRms = getPowerOfSignalAndUpdateStore(analyser);

    let multi = 1;
    let doubleMult = 1;
    if (newRms > 0.0 && newRightX > 0) {
      multi = map(newRms, 0.01, 0.1, 0, 1) * 2;
      if (newLeftX) {
        doubleMult = multi * 3;
      }
    }
    const stepSizeX = Math.floor(map(newLeftX, 0, canvas.width, 5, 30));
    const stepSizeY = Math.floor(
      map(newLeftY, 0, canvas.height, stepSizeX, stepSizeX * 2)
    );

    for (let y = 0; y < canvas.height; y += stepSizeY) {
      for (let x = 0; x < canvas.width; x += stepSizeX) {
        let index = (x + y * canvas.width) * 4;
        let redVal = pixels[index];
        let greenVal = pixels[index + 1];
        let blueVal = pixels[index + 2];
        let flippedX = canvas.width - x - stepSizeX;
        ctx.fillStyle = `rgb(${redVal * multi}, ${greenVal * multi}, ${
          blueVal * multi
        })`;
        ctx.fillRect(flippedX, y + multi, stepSizeX * doubleMult, stepSizeY);
      }
    }
    ctx.restore();
  }

  // initiate state mapping
  const stateMapping = {
    LeftX: "reverb",
    LeftY: "tremolo",
    RightX: "shift",
    RightY: "feedback",
  };

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

    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      drawOnCanvas(ctx, canvasRef.current, videoRef.current);
    }
  }

  // update effecs in zustand store depending on what hand data is coming in
  function updateEffects(hand, x, y) {
    const { setTarget } = useEffectStore.getState();
    // fliiping hands to correct for webcam switch
    const handPrefix = hand === "Left" ? "Right" : "Left";
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

  useEffect(() => {
    let animationFrameId;

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
      if (!isAnimatingRef.current) return;
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
          // Request next frame processing
          if (results) {
            processResults(results);
          }
          animationFrameId = requestAnimationFrame(predictWebcam);
        }
      }
    }

    // Initiate the hand tracking setup
    if (isAnimating) {
      setupHandTracking().then(enableWebcam);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function (track) {
          track.stop();
        });

        videoRef.current.srcObject = null;
      }
    };
  }, [isMobile, isAnimating]);

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
      {!isAnimating && (
        <video
          ref={previewVideoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: "absolute",
            width: "25%", // Size of the preview relative to its container
            height: "auto",
            bottom: "10px",
            right: "10px",
            borderRadius: "10px",
            border: "2px solid white",
            transform: "scaleX(-1)", // Mirroring the video
          }}
        />
      )}
    </div>
  );
};

export default HandTracking;
