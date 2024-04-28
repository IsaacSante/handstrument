import React, { useEffect, useState } from "react";
import Section from "./layout/section";

type DevScreenProps = {
  leftHandActive: React.MutableRefObject<boolean>;
  leftHandPinched: React.MutableRefObject<boolean>;
  rightHandActive: React.MutableRefObject<boolean>;
  rightHandPinched: React.MutableRefObject<boolean>;
  rightHandVel: React.MutableRefObject<number>;
  leftHandVel: React.MutableRefObject<number>;
};

const DevScreen: React.FC<DevScreenProps> = ({
  leftHandActive,
  leftHandPinched,
  rightHandActive,
  rightHandPinched,
  rightHandVel,
  leftHandVel,
}) => {
  const [values, setValues] = useState({
    leftHandActiveVal: false,
    leftHandPinchedVal: false,
    rightHandActiveVal: false,
    rightHandPinchedVal: false,
    rightHandVelVal: 0,
    leftHandVelVal: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setValues({
        leftHandActiveVal: leftHandActive.current,
        leftHandPinchedVal: leftHandPinched.current,
        rightHandActiveVal: rightHandActive.current,
        rightHandPinchedVal: rightHandPinched.current,
        rightHandVelVal: rightHandVel.current,
        leftHandVelVal: leftHandVel.current,
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Section title="Dev Tools">
      <div>
        <p>Left Hand Active: {values.leftHandActiveVal.toString()}</p>
        <p>Left Hand Pinched: {values.leftHandPinchedVal.toString()}</p>
        <p>Right Hand Active: {values.rightHandActiveVal.toString()}</p>
        <p>Right Hand Pinched: {values.rightHandPinchedVal.toString()}</p>
        <p>Right Hand Velocity: {values.rightHandVelVal}</p>
        <p>Left Hand Velocity: {values.leftHandVelVal}</p>
      </div>
    </Section>
  );
};

export default DevScreen;
