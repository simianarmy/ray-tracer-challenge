import { position } from "./ray";
import { add, dot, negate, multiply, reflect } from "./tuple";
import { EPSILON } from "./math";

/**
 * @constructor
 * @param {Number} t scalar
 * @param {Shape} object
 */
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
    normalv: is.object.normalAt(point),
  };

  if (dot(comps.normalv, comps.eyev) < 0) {
    comps.inside = true;
    comps.normalv = negate(comps.normalv);
  } else {
    comps.inside = false;
  }

  // prevent acne by placing intersection point slightly 'above' point in
  // direction of normalv
  comps.overPoint = add(comps.point, multiply(comps.normalv, EPSILON));

  // compute reflection vector
  comps.reflectv = reflect(ray.direction, comps.normalv);

  return comps;
}
