export const Stripe = (c1, c2) => {
  return {
    a: c1,
    b: c2
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
