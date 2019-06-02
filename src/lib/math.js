import { Noise } from "noisejs";

// Floating point equality
export const EPSILON = 0.00001;
export const floatIsEqual = (f1, f2) => Math.abs(f1 - f2) < EPSILON; // Number.EPSILON;
export const degreesToRadians = d => d / 180 * Math.PI;

export const perlin = (x, y, z) => {
  // one time initialization of Noise object
  if (!perlin.Noise) {
    perlin.Noise = new Noise(Math.random());
  }

  return perlin.Noise.perlin3(x, y, z);
}


