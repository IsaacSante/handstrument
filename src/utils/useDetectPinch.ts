import { Landmark, Landmarks } from "../types/handTracking";
import { MutableRefObject } from "react";
import { calculateVelocity } from "./useCalculateVelocity";

const bufferLength = 5;

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
  bufferRef: MutableRefObject<any>
) => {
  if (!bufferRef.current) {
    bufferRef.current = createBuffer(bufferLength);
  }

  const velocityMultiplier = 1000;
  const pinchThreshold = 0.1;
  const distance = calculateDistance(
    landmarks[indexFingerTipIndex],
    landmarks[thumbTipIndex]
  );

  const isPinching = distance < pinchThreshold;
  bufferRef.current.push(isPinching);

  handPinched.current = bufferRef.current.isPinching();
  if (handPinched.current) {
    // console.log(`${handType} hand is pinching`);
    // Now also calculate velocity for landmark at index 6
    const velocity =
      calculateVelocity(landmarks[6], handType) * velocityMultiplier;
    console.log(`${handType} hand velocity:`, velocity);
  }
};

export default useDetectPinch;
