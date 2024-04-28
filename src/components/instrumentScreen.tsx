import Section from "./layout/section";
import { useState, useEffect } from "react";
import ProgressBar from "./ui/progressBar";
import playKick from "../utils/tone/usePlayKick";
import playSnare from "../utils/tone/usePlaySnare";

type InstrumentUIProps = {
  note: string;
  leftHandPinched: React.MutableRefObject<boolean>;
  rightHandPinched: React.MutableRefObject<boolean>;
  rightHandVel: React.MutableRefObject<number>;
  leftHandVel: React.MutableRefObject<number>;
  isMobile: boolean;
};

const COOLDOWN_PERIOD: number = 300;
const UPDATE_INTERVAL: number = 1000;

const InstrumentScreen: React.FC<InstrumentUIProps> = ({
  note,
  leftHandPinched,
  rightHandPinched,
  rightHandVel,
  leftHandVel,
  isMobile,
}) => {
  const [lastPlayed, setLastPlayed] = useState<number>(0); // Timestamp of the last note played
  const [velocities, setVelocities] = useState<{
    leftVel: number;
    rightVel: number;
  }>({ leftVel: 0, rightVel: 0 });

  const [values, setValues] = useState({
    leftHandPinchedVal: false,
    rightHandPinchedVal: false,
  });

  const VELOCITY_THRESHOLD: number = isMobile ? 0.4 : 1.5;

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
          playKick(note);
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
        leftHandPinchedVal: leftHandPinched.current,
        rightHandPinchedVal: rightHandPinched.current,
      });
    }, UPDATE_INTERVAL);

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
            While keeping the pinch, move the finger.
          </div>
        </Section>
      )}
    </>
  );
};

export default InstrumentScreen;
