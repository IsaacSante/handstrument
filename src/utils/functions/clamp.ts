export const clamp = (value: number): number =>
  parseFloat(Math.max(0, Math.min(1, value)).toFixed(2));
