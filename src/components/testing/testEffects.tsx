import React, { useEffect, useState, useRef } from "react";
import { useEffectStore } from "../../../useEffectStore";
import { clamp } from "../../utils/functions/clamp";
import { roundNum } from "../../utils/functions/round";
import { mapRange } from "../../utils/functions/map";
import ProgressBar from "../ui/progressBar";
// Define a type for the effects to specify the structure and types
type Effects = {
  shift: number;
  tremolo: number;
  feedback: number;
  reverb: number;
};

const TestEffects: React.FC = () => {
  const effectsRef = useRef<Effects>(useEffectStore.getState().targets); // useRef with type
  const [effects, setEffects] = useState<Effects>(effectsRef.current); // useState with type
  const [displayEffects, setDisplayEffects] = useState<Effects>(effects); // useState with type for transformed effects

  // Function to transform effect values, applying different operations based on the key
  const transformEffects = (effects: Effects): Effects => {
    return Object.keys(effects).reduce(
      (acc, key) => {
        const effectValue = effects[key as keyof Effects];
        switch (key) {
          case "shift":
            acc[key as keyof Effects] = roundNum(
              mapRange(effectValue, -12, 12)
            );
            break;
          case "tremolo":
            acc[key as keyof Effects] = roundNum(effectValue);
            break;
          case "feedback":
            acc[key as keyof Effects] = roundNum(clamp(effectValue * 1.2));
            break;
          case "reverb":
            acc[key as keyof Effects] = roundNum(clamp(effectValue * 1.2));
            break;
          default:
            acc[key as keyof Effects] = effectValue;
        }
        return acc;
      },
      { ...effects }
    );
  };

  useEffect(() => {
    const unsubscribe = useEffectStore.subscribe(() => {
      const newEffects = useEffectStore.getState().targets;
      if (effectsRef.current !== newEffects) {
        effectsRef.current = newEffects; // Update the ref
        setEffects(newEffects); // Update state if actual changes occur
        setDisplayEffects(transformEffects(newEffects)); // Transform and set display effects
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div>
        {Object.entries(displayEffects).map(([key, value]) => {
          // Determine the range based on the key
          let min = 0;
          let max = 1;
          if (key === "shift") {
            min = -12;
            max = 12;
          }

          return (
            <div key={key}>
              <ProgressBar
                title={key}
                subtitle={`${value}`}
                targetNumber={value}
                startRange={min}
                endRange={max}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestEffects;
