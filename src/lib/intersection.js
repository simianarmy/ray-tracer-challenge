import { position } from "./ray";
import { add, dot, negate, multiply, reflect, sub } from "./tuple";
import { EPSILON } from "./math";

/**
 * @constructor
 * @param {Number} t scalar
 * @param {Shape} object
 * @param {Object} optional uv (for triangles only)
 *  {Number} u
 *  {Number} v
 */
export const Intersection = (t, object, uv = {}) => {
  return {
    t,
    object,
    ...uv
  };
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
 * @param {Array[Intersection]} xs
 * @returns {Object}
 */
export const prepareComputations = (is, ray, xs = [is]) => {
  const point = position(ray, is.t);

  let comps = {
    t: is.t,
    object: is.object,
    point,
    eyev: negate(ray.direction),
    normalv: is.object.normalAt(point, xs[0])
  };

  if (dot(comps.normalv, comps.eyev) < 0) {
    comps.inside = true;
    comps.normalv = negate(comps.normalv);
  } else {
    comps.inside = false;
  }

  const fraction = multiply(comps.normalv, EPSILON);

  // prevent acne by placing intersection point slightly 'above' point in
  // direction of normalv
  comps.overPoint = add(comps.point, fraction);

  // compute underPoint to describe where refracted rays will originate
  comps.underPoint = sub(comps.point, fraction);

  // compute reflection vector
  comps.reflectv = reflect(ray.direction, comps.normalv);

  // compute refractive indicdes
  let containers = [],
    n1 = null,
    n2 = null;

  for (let i = 0; i < xs.length; i++) {
    const intersection = xs[i];
    const equalsHit = intersection.t === is.t && intersection.object.id === is.object.id;

    // if intersection is the hit
    if (equalsHit) {
      if (!containers.length) {
        n1 = 1.0;
      } else {
        n1 = containers[containers.length - 1].material.refractiveIndex;
      }
    }

    if (containers.find(c => c.id === intersection.object.id)) {
      // remove object from containers
      containers = containers.filter(c => c.id !== intersection.object.id);
    } else {
      containers.push(intersection.object);
    }

    if (equalsHit) {
      if (!containers.length) {
        n2 = 1.0;
      } else {
        n2 = containers[containers.length - 1].material.refractiveIndex;
      }

      break;
    }
  }

  comps.n1 = n1;
  comps.n2 = n2;

  return comps;
};

/**
 * Calculates Schlick approximation from precomputed object
 * @returns {Number}
 */
export const schlick = comps => {
  let cos = dot(comps.eyev, comps.normalv);

  // total internal reflection can only occur if n1 > n2
  if (comps.n1 > comps.n2) {
    const n = comps.n1 / comps.n2;
    const sin2T = n * n * (1.0 - cos * cos);

    if (sin2T > 1.0) {
      return 1.0;
    }

    // compute cosine of theta_t
    const cosT = Math.sqrt(1.0 - sin2T);

    cos = cosT;
  }

  const r0 = Math.pow((comps.n1 - comps.n2) / (comps.n1 + comps.n2), 2);

  return r0 + (1 - r0) * Math.pow(1 - cos, 5);
};
