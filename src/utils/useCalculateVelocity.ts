// calculateVelocity.ts
import { Landmark } from "../types/handTracking";

type HandType = "Left" | "Right";

type Velocity = { x: number; y: number; z: number };
type VelocityState = {
  left: {
    velocities: Velocity[];
    previousPosition: Landmark | null;
    previousTime: number;
  };
  right: {
    velocities: Velocity[];
    previousPosition: Landmark | null;
    previousTime: number;
  };
};

let state: VelocityState = {
  left: {
    velocities: [],
    previousPosition: null,
    previousTime: Date.now(),
  },
  right: {
    velocities: [],
    previousPosition: null,
    previousTime: Date.now(),
  },
};

const calculateMagnitude = (velocity: Velocity): number => {
  const { x, y, z } = velocity;
  return Math.sqrt(x * x + y * y + z * z);
};

export const calculateVelocity = (
  currentPosition: Landmark,
  handType: HandType,
  bufferLength: number = 5
): number => {
  const currentTime = Date.now();
  const handState = state[handType.toLowerCase() as keyof typeof state];

  if (handState.previousPosition) {
    const timeDiff = currentTime - handState.previousTime;
    if (timeDiff > 0) {
      const newVelocity = {
        x: (currentPosition.x - handState.previousPosition.x) / timeDiff,
        y: (currentPosition.y - handState.previousPosition.y) / timeDiff,
        z: (currentPosition.z - handState.previousPosition.z) / timeDiff,
      };
      handState.velocities.push(newVelocity);
      if (handState.velocities.length > bufferLength)
        handState.velocities.shift();
    }
  }

  handState.previousPosition = currentPosition;
  handState.previousTime = currentTime;

  const averageMagnitude =
    handState.velocities.reduce(
      (acc, cur) => acc + calculateMagnitude(cur),
      0
    ) / handState.velocities.length;

  const maxExpectedMagnitude = 1; // Adjust based on application needs
  return Math.min(averageMagnitude / maxExpectedMagnitude, 1);
};

export default calculateVelocity;
