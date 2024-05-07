// pitch -12 to 12
//pitchShift.pitch = -12; //down one octave
//pitchShift.pitch = 7; //up a fifth

export function mapRange(value, newMin, newMax) {
  return newMin + (newMax - newMin) * value;
}
