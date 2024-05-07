import React, { useEffect, useState, useRef } from "react";
import { useEffectStore } from "../../../useEffectStore";

const TestEffects: React.FC = () => {
  const effectsRef = useRef(useEffectStore.getState().effects); // useRef to hold the current effects
  const [effects, setEffects] = useState(effectsRef.current); // useState to trigger re-render

  useEffect(() => {
    const unsubscribe = useEffectStore.subscribe(() => {
      const newEffects = useEffectStore.getState().effects;
      if (effectsRef.current !== newEffects) {
        effectsRef.current = newEffects; // Update the ref
        setEffects(newEffects); // Update state if actual changes occur
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Effects</h1>
      <ul>
        {Object.entries(effects).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestEffects;
