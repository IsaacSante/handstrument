import { Analyser } from "tone";

export function getPowerOfSignalAndUpdateStore(analyser: Analyser) {
  const waveform = analyser.getValue();
  if (waveform instanceof Float32Array) {
    let sumOfSquares = 0;
    for (const value of waveform) {
      sumOfSquares += value * value;
    }
    const meanOfSquares = sumOfSquares / waveform.length;
    const rms = Math.sqrt(meanOfSquares);
    return rms;
  }
  return 0;
}
