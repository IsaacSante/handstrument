import Section from "./layout/section";
import { useState, useEffect } from "react";
import ProgressBar from "./ui/progressBar";
import playKick from "../utils/tone/usePlayKick";
import playSnare from "../utils/tone/usePlaySnare";

type InstrumentUIProps = {
  leftHandActive: React.MutableRefObject<boolean>;
  leftHandPinched: React.MutableRefObject<boolean>;
  rightHandActive: React.MutableRefObject<boolean>;
  rightHandPinched: React.MutableRefObject<boolean>;
  rightHandVel: React.MutableRefObject<number>;
  leftHandVel: React.MutableRefObject<number>;
};

const VELOCITY_THRESHOLD: number = 2.0;
const COOLDOWN_PERIOD: number = 200;

const InstrumentScreen: React.FC<InstrumentUIProps> = ({
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

  const [values, setValues] = useState({
    leftHandActiveVal: false,
    leftHandPinchedVal: false,
    rightHandActiveVal: false,
    rightHandPinchedVal: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newLeftVel: number = leftHandVel.current;
      const newRightVel: number = rightHandVel.current;
      const currentTime: number = Date.now();

      setVelocities({ leftVel: newLeftVel, rightVel: newRightVel });

      if (currentTime - lastPlayed > COOLDOWN_PERIOD) {
        if (newLeftVel > VELOCITY_THRESHOLD) {
          playSnare();
          setLastPlayed(currentTime);
        }

        if (newRightVel > VELOCITY_THRESHOLD) {
          playKick();
          setLastPlayed(currentTime);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [lastPlayed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValues({
        leftHandActiveVal: leftHandActive.current,
        leftHandPinchedVal: leftHandPinched.current,
        rightHandActiveVal: rightHandActive.current,
        rightHandPinchedVal: rightHandPinched.current,
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {values.leftHandPinchedVal || values.rightHandPinchedVal ? (
        <Section title="Move to trigger drum sound!">
          <ProgressBar
            title="Left Hand"
            subtitle="Snare Gain"
            targetNumber={velocities.leftVel}
            startRange={0}
            endRange={3}
          />
          <ProgressBar
            title="Right Hand"
            subtitle="Kick Gain"
            targetNumber={velocities.rightVel}
            startRange={0}
            endRange={3}
          />
        </Section>
      ) : (
        <Section title="Play the drums with your hands">
          <div>
            Pinch your thumb and index finger. <br />
            Starting moving while you pinch!
          </div>
        </Section>
      )}
    </>
  );
};

export default InstrumentScreen;
