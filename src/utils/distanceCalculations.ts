import { Landmark, Landmarks } from "../types/handTracking";
import { MutableRefObject } from "react";

const calculateDistance = (point1: Landmark, point2: Landmark) => {
  const xDiff = point1.x - point2.x;
  const yDiff = point1.y - point2.y;
  const zDiff = point1.z - point2.z;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
};

const detectPinch = (
  landmarks: Landmarks,
  indexFingerTipIndex: number,
  thumbTipIndex: number,
  handType: "Left" | "Right",
  handPinched: MutableRefObject<boolean>
) => {
  const pinchThreshold = 0.1;
  const distance = calculateDistance(
    landmarks[indexFingerTipIndex],
    landmarks[thumbTipIndex]
  );

  const isPinching = distance < pinchThreshold;
  if (isPinching) {
    handPinched.current = true;
    console.log(`${handType} hand is pinching`);
  } else {
    handPinched.current = false;
  }
};

export default detectPinch;
