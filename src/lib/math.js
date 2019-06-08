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

/**
 * generalized ray-plane intersection alg. helper
 * assuming planes offset -1, 1 from origin
 * @param {Number} origin
 * @param {Number} direction
 * @returns [Number, Number] tmin, tmax
 */
export const checkAxis = (origin, direction) => {
  const tminNumerator = -1 - origin;
  const tmaxNumerator = 1 - origin;
  let tmin, tmax;

  if (Math.abs(direction) >= EPSILON) {
    tmin = tminNumerator / direction;
    tmax = tmaxNumerator / direction;
  } else {
    tmin = tminNumerator * Number.POSITIVE_INFINITY;
    tmax = tmaxNumerator * Number.POSITIVE_INFINITY;
  }

  return (tmin > tmax) ? [tmax, tmin] : [tmin, tmax];
}
