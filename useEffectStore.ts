import { create } from "zustand";

type EffectState = {
  effects: {
    shift: number;
    lowpass: number;
    feedback: number;
    reverb: number;
  };
  setEffect: (key: keyof EffectState["effects"], value: number) => void;
};

export const useEffectStore = create<EffectState>((set) => ({
  effects: {
    shift: 0,
    lowpass: 0,
    feedback: 0,
    reverb: 0,
  },

  setEffect: (key, value) =>
    set((state) => ({
      effects: {
        ...state.effects,
        [key]: value,
      },
    })),
}));
