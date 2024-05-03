import { create } from "zustand";

type EffectState = {
  effects: {
    lowpass: number;
    feedback: number;
    reverb: number;
    pitchShift: number;
  };
  setEffect: (key: keyof EffectState["effects"], value: number) => void;
};

export const useEffectStore = create<EffectState>((set) => ({
  effects: {
    lowpass: 0,
    feedback: 0,
    reverb: 0,
    pitchShift: 0.0,
  },

  setEffect: (key, value) =>
    set((state) => ({
      effects: {
        ...state.effects,
        [key]: value,
      },
    })),
}));
