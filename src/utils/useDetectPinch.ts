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
interface DrawPointParams {
  canvasCtx: CanvasRenderingContext2D;
  x: number;
  y: number;
  isPinching: boolean;
}

const drawPoint = ({ canvasCtx, x, y, isPinching }: DrawPointParams) => {
  const canvasWidth = canvasCtx.canvas.width;
  const canvasHeight = canvasCtx.canvas.height;
  const actualX = x * canvasWidth;
  const actualY = y * canvasHeight;

  // Begin path for new drawing
  canvasCtx.beginPath();
  canvasCtx.arc(actualX, actualY, isPinching ? 20 : 10, 0, 2 * Math.PI);

  // Apply styles only if necessary
  const newFillStyle = isPinching ? "red" : "blue";
  if (canvasCtx.fillStyle !== newFillStyle) {
    canvasCtx.fillStyle = newFillStyle;
  }

  canvasCtx.fill();
};

const useDetectPinch = (
  landmarks: Landmarks,
  indexFingerTipIndex: number,
  thumbTipIndex: number,
  handType: "Left" | "Right",
  handPinched: MutableRefObject<boolean>,
  bufferRef: MutableRefObject<any>,
  handVelocity: MutableRefObject<number>,
  canvasCtx: CanvasRenderingContext2D,
  isMobile: boolean
) => {
  if (!canvasCtx) return;

  const bufferLength = 5;
  const velocityDecayRate = 0.9;

  if (!bufferRef.current) {
    bufferRef.current = createBuffer(bufferLength);
  }

  const velocityMultiplier = 1000;
  const pinchThreshold = isMobile ? 0.035 : 0.1;
  const distance = calculateDistance(
    landmarks[indexFingerTipIndex],
    landmarks[thumbTipIndex]
  );

  const isPinching = distance < pinchThreshold;
  bufferRef.current.push(isPinching);

  handPinched.current = bufferRef.current.isPinching();

  drawPoint({
    canvasCtx,
    x: landmarks[indexFingerTipIndex].x,
    y: landmarks[indexFingerTipIndex].y,
    isPinching: isPinching,
  });

  if (handPinched.current) {
    handVelocity.current =
      calculateVelocity(landmarks[6], handType) * velocityMultiplier;
    // console.log(`${handType} hand velocity:`, handVelocity.current);
  } else {
    // Apply velocity decay when not pinching
    handVelocity.current *= velocityDecayRate;
    if (handVelocity.current < 0.01) handVelocity.current = 0; // Threshold to zero to avoid infinitesimal values
  }
};

export default useDetectPinch;
