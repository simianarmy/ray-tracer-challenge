import { normalAt } from "./sphere";
import { position } from "./ray";
import { dot, negate } from "./tuple";

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
 * @param {Array[Intersections]}
 * @returns {Intersection}
 */
export const hit = xs => {
  let minT = Number.MAX_VALUE;
  let minIndex = -1;

  for (let i = 0; i < xs.length; i++) {
    if (xs[i].t >= 0 && xs[i].t < minT) {
      minT = xs[i].t;
      minIndex = i;
    }
  }

  return minIndex === -1 ? null : xs[minIndex];
};

/**
 * @param {Intersection} is
 * @param {Ray} ray
 * @returns {Object}
 */
export const prepareComputations = (is, ray) => {
  const point = position(ray, is.t);

  let comps = {
    t: is.t,
    object: is.object,
    point,
    eyev: negate(ray.direction),
    normalv: normalAt(is.object, point)
  };

  if (dot(comps.normalv, comps.eyev) < 0) {
    comps.inside = true;
    comps.normalv = negate(comps.normalv);
  } else {
    comps.inside = false;
  }

  return comps;
}
