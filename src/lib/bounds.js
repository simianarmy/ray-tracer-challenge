/**
 * Support for Bounding Boxes
 */
import { point } from "./tuple";

export const Bounds = () => {
  let min = point(-1, -1, -1);
  let max = point(1, 1, 1);

  return {
    min, max
  };
};

