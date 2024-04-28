import { Landmark, Landmarks } from "../types/handTracking";
import { MutableRefObject } from "react";
import { calculateVelocity } from "./useCalculateVelocity";

const createBuffer = (length: number) => {
  const buffer = new Array(length).fill(false);
  return {
    push: (value: boolean) => {
      buffer.push(value);
      buffer.shift();
    },
    isPinching: () => {
      return buffer.reduce((acc, cur) => acc + (cur ? 1 : 0), 0) > length / 2;
    },
  };
};

const calculateDistance = (point1: Landmark, point2: Landmark) => {
  const xDiff = point1.x - point2.x;
  const yDiff = point1.y - point2.y;
  const zDiff = point1.z - point2.z;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
};

const useDetectPinch = (
  landmarks: Landmarks,
  indexFingerTipIndex: number,
  thumbTipIndex: number,
  handType: "Left" | "Right",
  handPinched: MutableRefObject<boolean>,
  bufferRef: MutableRefObject<any>,
  handVelocity: MutableRefObject<number>
) => {
  const bufferLength = 10;
  const velocityDecayRate = 0.9; // Decay rate per frame

  if (!bufferRef.current) {
    bufferRef.current = createBuffer(bufferLength);
  }

  const velocityMultiplier = 1000;
  const pinchThreshold = 0.2;
  const distance = calculateDistance(
    landmarks[indexFingerTipIndex],
    landmarks[thumbTipIndex]
  );

  const isPinching = distance < pinchThreshold;
  bufferRef.current.push(isPinching);

  handPinched.current = bufferRef.current.isPinching();

  if (handPinched.current) {
    handVelocity.current =
      calculateVelocity(landmarks[6], handType) * velocityMultiplier;
    console.log(`${handType} hand velocity:`, handVelocity.current);
  } else {
    // Apply velocity decay when not pinching
    handVelocity.current *= velocityDecayRate;
    if (handVelocity.current < 0.01) handVelocity.current = 0; // Threshold to zero to avoid infinitesimal values
  }
};

export default useDetectPinch;
