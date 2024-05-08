import { FeedbackDelay } from "tone";
import { clamp } from "../../functions/clamp";
import { roundNum } from "../../functions/round";
// Function to create and return a feedback delay effect with a dynamic note value
export function createFeedbackDelay(note = "2n") {
  return new FeedbackDelay(note, 0).toDestination();
}

// Function to update feedback delay effect
export function updateFeedbackEffect(
  feedbackDelay: FeedbackDelay,
  wetness: number
) {
  let controlWetness;
  if (wetness == 0) {
    controlWetness = 0;
  } else {
    controlWetness = clamp(wetness * 1.2);
  }
  feedbackDelay.wet.value = roundNum(controlWetness);
}
