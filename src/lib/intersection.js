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
