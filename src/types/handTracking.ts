import { Analyser } from "tone";
export type HandTrackingProps = {
  analyser: Analyser;
  isMobile: boolean;
  isAnimating: boolean;
};

export type Handedness = {
  score: number;
  index: number;
  categoryName: string;
  displayName: "Left" | "Right";
};

export type HandednessArray = Handedness[][];

export type Landmark = {
  x: number;
  y: number;
  z: number;
};

export type Landmarks = Landmark[];
