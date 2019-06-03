import { position } from "./ray";
import { add, dot, negate, multiply, reflect, sub } from "./tuple";
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
    normalv: is.object.normalAt(point)
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
    const equalsHit = intersection == is;

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
