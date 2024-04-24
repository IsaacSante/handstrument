export type HandTrackingProps = {
  leftHandActive: React.MutableRefObject<boolean>;
  rightHandActive: React.MutableRefObject<boolean>;
  leftHandPinched: React.MutableRefObject<boolean>;
  rightHandPinched: React.MutableRefObject<boolean>;
};

export type Handedness = {
  score: number;
  index: number;
  categoryName: string;
  displayName: "Left" | "Right";
};

export type HandednessArray = Handedness[][];
