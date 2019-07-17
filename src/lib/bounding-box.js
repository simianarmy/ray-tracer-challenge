import { point } from "./tuple";

/**
 * @param {Bounds} bounds
 * @returns {Array[point]}
 */
export const BoundingBox = (bounds) => {
  // Determine 8 corners of the box from bounds
  // (minx, miny, minz), (minx, miny, maxz), (minx, maxy, minz), ... (maxx,
  // maxy, maxz)
  let c1 = point(bounds.min.x, bounds.min.y, bounds.min.z);
  let c2 = point(bounds.min.x, bounds.min.y, bounds.max.z);
  let c3 = point(bounds.min.x, bounds.max.y, bounds.min.z);
  let c4 = point(bounds.min.x, bounds.max.y, bounds.max.z);
  let c5 = point(bounds.max.x, bounds.min.y, bounds.min.z);
  let c6 = point(bounds.max.x, bounds.min.y, bounds.max.z);
  let c7 = point(bounds.max.x, bounds.max.y, bounds.min.z);
  let c8 = point(bounds.max.x, bounds.max.y, bounds.max.z);

  return {
    bounds,
    corners: [c1, c2, c3, c4, c5, c6, c7, c8]
  };
}
