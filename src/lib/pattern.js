import { Matrix, multiplyTuple, inverse } from "./matrix";

export const Stripe = (c1, c2) => {
  let t = Matrix.identity;

  return {
    a: c1,
    b: c2,
    getTransform: () => t,
    setTransform: (transform) => {
      t = transform;
    }
  };
};

/**
 * @param {Stripe} s
 * @param {Point} p
 * @returns {Color}
 */
export const stripeAt = (s, p) => {
  if (Math.floor(p.x) % 2 === 0) {
    return s.a;
  } else {
    return s.b;
  }
};

/**
 * @param {Stripe} s
 * @param {Shape} object
 * @param {Point} p
 * @returns {Color}
 */
export const stripeAtObject = (pattern, object, p) => {
  const localPoint = multiplyTuple(inverse(object.getTransform()), p);
  const patternPoint = multiplyTuple(inverse(pattern.getTransform()), localPoint);

  return stripeAt(pattern, patternPoint);
};
