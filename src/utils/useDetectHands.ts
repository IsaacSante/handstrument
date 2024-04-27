import useDetectPinch from "./useDetectPinch";
import { MutableRefObject } from "react";
import { HandednessArray, Landmarks } from "../types/handTracking";

interface UseDetectHandsParams {
  handednesses: HandednessArray;
  landmarks: Landmarks[];
  rightHandActive: MutableRefObject<boolean>;
  rightHandPinched: MutableRefObject<boolean>;
  rightHandVelocity: MutableRefObject<number>; // Add this
  rightHandPinchBuffer: MutableRefObject<null | number[]>;
  leftHandActive: MutableRefObject<boolean>;
  leftHandPinched: MutableRefObject<boolean>;
  leftHandVelocity: MutableRefObject<number>; // Add this
  leftHandPinchBuffer: MutableRefObject<null | number[]>;
}

const useDetectHands = ({
  handednesses,
  landmarks,
  rightHandActive,
  rightHandPinched,
  rightHandPinchBuffer,
  rightHandVelocity,
  leftHandActive,
  leftHandPinched,
  leftHandPinchBuffer,
  leftHandVelocity,
}: UseDetectHandsParams): void => {
  let foundLeftHand = false;
  let foundRightHand = false;

  for (let i = 0; i < handednesses.length; i++) {
    const handedness = handednesses[i];
    if (handedness.length > 0) {
      const hand = handedness[0]; // Assuming only one handedness per hand
      if (hand.displayName === "Left") {
        foundRightHand = true;
        rightHandActive.current = true;
        useDetectPinch(
          landmarks[i],
          8,
          4,
          "Right",
          rightHandPinched,
          rightHandPinchBuffer,
          rightHandVelocity
        );
      } else if (hand.displayName === "Right") {
        foundLeftHand = true;
        leftHandActive.current = true;
        useDetectPinch(
          landmarks[i],
          8,
          4,
          "Left",
          leftHandPinched,
          leftHandPinchBuffer,
          leftHandVelocity
        );
      }
    }
  }

  if (!foundLeftHand) {
    leftHandActive.current = false;
  }
  if (!foundRightHand) {
    rightHandActive.current = false;
  }
};

export default useDetectHands;
