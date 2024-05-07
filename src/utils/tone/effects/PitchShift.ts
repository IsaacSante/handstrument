import { PitchShift } from "tone";
import { mapRange } from "../../functions/map";

export function createPitchShift() {
  return new PitchShift(0).toDestination();
}

export function updatePitchShift(PitchShift: PitchShift, newPitch: number) {
  const mappedPitch = mapRange(newPitch, -12, 12);
  //console.log(newPitch);
  PitchShift.pitch = mappedPitch;
}
