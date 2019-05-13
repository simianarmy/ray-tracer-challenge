import { add, multiply } from "./tuple";
import { multiplyTuple } from "./matrix";

/**
 * @param {Point} origin
 * @param {Vector} direction
 */
export const Ray = (origin, direction) => {
  return {
    origin,
    direction
  };
};

/**
 * Calculates position of a ray at time t
 * @returns {Point}
 */
export const position = (ray, t) => {
  return add(ray.origin, multiply(ray.direction, t));
};

/**
 * @param {Ray} r
 * @param {Matrix} m
 * @returns {Ray}
 */
export const transform = (r, m) => {
  return Ray(multiplyTuple(m, r.origin), multiplyTuple(m, r.direction));
};
