export type HandTrackingProps = {
  leftHandActive: React.MutableRefObject<boolean>;
  rightHandActive: React.MutableRefObject<boolean>;
  leftHandPinched: React.MutableRefObject<boolean>;
  rightHandPinched: React.MutableRefObject<boolean>;
  leftHandVelocity: React.MutableRefObject<number>;
  rightHandVelocity: React.MutableRefObject<number>;
  isMobile: boolean;
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
