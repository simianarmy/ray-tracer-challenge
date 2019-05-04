import { Matrix, inverse, multiplyTuple, transpose } from "./matrix";
import { normalize, point, sub } from "./tuple";
import { Material } from "./material";

const uuidv1 = require("uuid/v1");

export const Sphere = () => {
  let transform = Matrix.identity;
  let material = Material();

  const getTransform = () => transform;
  const setTransform = t => (transform = t);

  return {
    id: uuidv1(),
    getTransform,
    setTransform,
    material
  };
};

/**
 * @returns {Vector}
 */
export const normalAt = (s, worldPoint) => {
  const objectPoint = multiplyTuple(inverse(s.getTransform()), worldPoint);
  const objectNormal = sub(objectPoint, point(0, 0, 0));
  const worldNormal = multiplyTuple(transpose(inverse(s.getTransform())), objectNormal);
  worldNormal.w = 0;

  return normalize(worldNormal);
};
