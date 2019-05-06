import { normalAt } from "./sphere";
import { position } from "./ray";
import { negate } from "./tuple";

export const Intersection = (t, object) => {
  return {
    t,
    object
  }
};

/**
 * @returns {Array[Intersection]}
 */
export const intersections = (...is) => {
  return [...is];
};

/**
 * @returns {Intersection}
 */
export const hit = is => {
  let minT = Number.MAX_VALUE;
  let minIndex = -1;

  for (let i = 0; i < is.length; i++) {
    if (is[i].t >= 0 && is[i].t < minT) {
      minT = is[i].t;
      minIndex = i;
    }
  }

  return minIndex === -1 ? null : is[minIndex];
};

/**
 * @returns {Object}
 */
export const prepareComputations = (is, ray) => {
  const point = position(ray, is.t);

  return {
    t: is.t,
    object: is.object,
    point,
    eyev: negate(ray.direction),
    normalv: normalAt(is.object, point)
  };
}
