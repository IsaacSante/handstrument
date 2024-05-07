import { create } from "zustand";
import { lerp } from "./src/utils/functions/lerp";

type EffectState = {
  effects: {
    shift: number;
    lowpass: number;
    feedback: number;
    reverb: number;
  };
  targets: {
    shift: number;
    lowpass: number;
    feedback: number;
    reverb: number;
  };
  setTarget: (key: keyof EffectState["effects"], value: number) => void;
  updateEffects: (deltaTime: number) => void;
};

export const useEffectStore = create<EffectState>((set, get) => ({
  effects: {
    shift: 0,
    lowpass: 0,
    feedback: 0,
    reverb: 0,
  },
  targets: {
    shift: 0,
    lowpass: 0,
    feedback: 0,
    reverb: 0,
  },
  setTarget: (key, value) =>
    set((state) => ({
      targets: {
        ...state.targets,
        [key]: value,
      },
    })),
  updateEffects: (deltaTime) => {
    const { effects, targets } = get();
    set({
      effects: Object.keys(effects).reduce(
        (acc, key) => {
          const effectKey = key as keyof EffectState["effects"];
          acc[effectKey] = lerp(
            effects[effectKey],
            targets[effectKey],
            deltaTime * 0.1
          ); // Adjust the 0.1 factor to control the speed
          return acc;
        },
        { ...effects }
      ),
    });
  },
}));
