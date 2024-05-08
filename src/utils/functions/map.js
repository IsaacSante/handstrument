/**
 * Maps a number from the range [0, 1] to [newMin, newMax], with the exception
 * that an input value of 0 returns 0.
 *
 * @param {number} value - The input value within the range [0, 1].
 * @param {number} newMin - The lower bound of the target range.
 * @param {number} newMax - The upper bound of the target range.
 * @returns {number} - The mapped value, with 0 specifically mapped to 0.
 */
export function mapRange(value, newMin, newMax) {
  if (value === 0) {
    return 0;
  }
  return newMin + (newMax - newMin) * value;
}
