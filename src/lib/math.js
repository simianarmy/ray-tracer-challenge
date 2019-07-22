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
 * @param {Number} minAxis min value for axis being tested
 * @param {Number} maxAxis max value for axis being tested
 * @returns [Number, Number] tmin, tmax
 */
export const checkAxis = (origin, direction, minAxis = -1, maxAxis = 1) => {
  const tminNumerator = minAxis - origin;
  const tmaxNumerator = maxAxis - origin;
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
