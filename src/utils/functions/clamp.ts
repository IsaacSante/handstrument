import _ from "lodash";

export const clamp = (value: number): number => {
  return parseFloat(_.clamp(value, 0, 1).toFixed(2));
};
