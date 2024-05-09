import { PitchShift } from "tone";
import { mapRange } from "../../functions/map";
import { roundNum } from "../../functions/round";
export function createPitchShift() {
  return new PitchShift(0).toDestination();
}

export function updatePitchShift(PitchShift: PitchShift, newPitch: number) {
  let controlPitch;
  if (newPitch == 0) {
    controlPitch = 0;
  } else {
    controlPitch = mapRange(newPitch, -12, 12) * 1.4;
  }
  let targetWetness = roundNum(controlPitch);
  PitchShift.pitch = targetWetness;
}
