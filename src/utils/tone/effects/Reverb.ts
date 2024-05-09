import { Reverb } from "tone";
import { clamp } from "../../functions/clamp";
import { roundNum } from "../../functions/round";
export function createReverb() {
  return new Reverb(2).toDestination();
}

export function updateReverbEffect(reverb: Reverb, wetness: number) {
  let controlWetness;
  if (wetness == 0) {
    controlWetness = 0;
  } else {
    controlWetness = clamp(wetness * 1.2);
  }
  let targetWetness = roundNum(controlWetness);
  reverb.wet.rampTo(targetWetness, 0.1);
}
