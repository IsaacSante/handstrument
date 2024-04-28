import React, { useEffect, useState } from "react";
import playNote from "../utils/tone/usePlaySong";

type DevScreenProps = {
  leftHandActive: React.MutableRefObject<boolean>;
  leftHandPinched: React.MutableRefObject<boolean>;
  rightHandActive: React.MutableRefObject<boolean>;
  rightHandPinched: React.MutableRefObject<boolean>;
  rightHandVel: React.MutableRefObject<number>;
  leftHandVel: React.MutableRefObject<number>;
};

const VELOCITY_THRESHOLD: number = 1.5;
const COOLDOWN_PERIOD: number = 200;

const DevScreen: React.FC<DevScreenProps> = ({
  leftHandActive,
  leftHandPinched,
  rightHandActive,
  rightHandPinched,
  rightHandVel,
  leftHandVel,
}) => {
  const [lastPlayed, setLastPlayed] = useState<number>(0); // Timestamp of the last note played
  const [velocities, setVelocities] = useState<{
    leftVel: number;
    rightVel: number;
  }>({ leftVel: 0, rightVel: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newLeftVel: number = leftHandVel.current;
      const newRightVel: number = rightHandVel.current;
      const currentTime: number = Date.now();

      setVelocities({ leftVel: newLeftVel, rightVel: newRightVel });

      if (
        (newLeftVel > VELOCITY_THRESHOLD || newRightVel > VELOCITY_THRESHOLD) &&
        currentTime - lastPlayed > COOLDOWN_PERIOD
      ) {
        playNote();
        setLastPlayed(currentTime);
      }
    }, 100); // Check every 100ms

    return () => {
      clearInterval(interval);
    };
  }, [lastPlayed]); // Dependence on lastPlayed to trigger re-rendering after playing a note

  return (
    <div>
      {/* <p>Left Hand Active: {leftHandActive.current.toString()}</p>
      <p>Left Hand Pinched: {leftHandPinched.current.toString()}</p>
      <p>Right Hand Active: {rightHandActive.current.toString()}</p>
      <p>Right Hand Pinched: {rightHandPinched.current.toString()}</p>
      <p>Right Hand Velocity: {velocities.rightVel}</p>
      <p>Left Hand Velocity: {velocities.leftVel}</p> */}
    </div>
  );
};

export default DevScreen;
