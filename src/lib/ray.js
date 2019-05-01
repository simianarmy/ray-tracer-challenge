import { add, dot, multiply, point, sub } from "./tuple";
import { Intersection } from "./intersection";

export const Ray = (origin, direction) => {
  return {
    origin,
    direction
  };
};

/**
 * @returns {Point}
 */
export const position = (ray, t) => {
  return add(ray.origin, multiply(ray.direction, t));
};

/**
 * @param {Sphere} s
 * @param {Ray} r
 * @returns {Array[Number]}
 */
export const intersect = (s, r) => {
  const sphereToRay = sub(r.origin, point(0, 0, 0));
  const a = dot(r.direction, r.direction);
  const b = 2 * dot(r.direction, sphereToRay);
  const c = dot(sphereToRay, sphereToRay) - 1;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return [];
  }

  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  return [Intersection(t1, s), Intersection(t2, s)];
};
