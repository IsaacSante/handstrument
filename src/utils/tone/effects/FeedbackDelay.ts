import { FeedbackDelay } from "tone";

// Function to create and return a feedback delay effect with a dynamic note value
export function createFeedbackDelay(note = "2n") {
  return new FeedbackDelay(note, 0).toDestination();
}

// Function to update feedback delay effect
export function updateFeedbackEffect(
  feedbackDelay: FeedbackDelay,
  wetness: number
) {
  //console.log(wetness);
  feedbackDelay.wet.value = wetness;
}
