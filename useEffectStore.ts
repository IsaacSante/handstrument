import { create } from "zustand";
import { lerp } from "./src/utils/functions/lerp";

const lerpSpeed = 0.7;

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
  resetValue: (key: keyof EffectState["effects"]) => void;
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
            deltaTime * lerpSpeed
          );
          return acc;
        },
        { ...effects }
      ),
    });
  },
  resetValue: (key) =>
    set((state) => ({
      effects: {
        ...state.effects,
        [key]: 0,
      },
      targets: {
        ...state.targets,
        [key]: 0,
      },
    })),
}));
