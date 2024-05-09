import { create } from "zustand";

type EffectState = {
  effects: {
    shift: number;
    tremolo: number;
    feedback: number;
    reverb: number;
  };
  targets: {
    shift: number;
    tremolo: number;
    feedback: number;
    reverb: number;
  };
  setTarget: (key: keyof EffectState["effects"], value: number) => void;
  resetValue: (key: keyof EffectState["effects"]) => void;
};

export const useEffectStore = create<EffectState>((set, get) => ({
  effects: {
    shift: 0,
    tremolo: 0,
    feedback: 0,
    reverb: 0,
  },
  targets: {
    shift: 0,
    tremolo: 0,
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
