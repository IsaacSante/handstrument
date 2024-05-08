export function mapRange(value, newMin, newMax) {
  return newMin + (newMax - newMin) * value;
}
