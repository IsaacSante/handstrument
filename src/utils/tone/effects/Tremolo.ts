import { Tremolo } from "tone";
import { roundNum } from "../../functions/round";
export function createTremolo() {
  return new Tremolo(5, 0.75).start().toDestination();
}

export function updateTremolo(tremolo: Tremolo, wetness: number) {
  let controlWetness;
  if (wetness == 0) {
    controlWetness = 0;
  } else {
    controlWetness = wetness;
  }
  let targetWetness = roundNum(controlWetness);
  tremolo.wet.rampTo(targetWetness, 0.1);
}
