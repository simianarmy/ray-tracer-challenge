import { Matrix} from "./matrix";

const uuidv1 = require('uuid/v1');

export const Sphere = () => {
  let transform = Matrix.identity;

  const getTransform = () => transform;
  const setTransform = t => transform = t;

  return {
    id: uuidv1(),
    getTransform,
    setTransform
  };
};
