import { Matrix } from "./matrix";
import { normalize, point, sub } from "./tuple";

const uuidv1 = require("uuid/v1");

export const Sphere = () => {
  let transform = Matrix.identity;

  const getTransform = () => transform;
  const setTransform = t => (transform = t);

  return {
    id: uuidv1(),
    getTransform,
    setTransform
  };
};

/**
 * @returns {Vector}
 */
export const normalAt = (s, p) => {
  return normalize(sub(p, point(0, 0, 0)));
};
