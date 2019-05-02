import { add, dot, multiply, point, sub } from "./tuple";
import { inverse, multiplyTuple } from "./matrix";
import { Intersection } from "./intersection";

/**
 * @param {Point} origin
 * @param {Vector} direction
 */
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
  const ray2 = transform(r, inverse(s.getTransform()));
  const sphereToRay = sub(ray2.origin, point(0, 0, 0));
  const a = dot(ray2.direction, ray2.direction);
  const b = 2 * dot(ray2.direction, sphereToRay);
  const c = dot(sphereToRay, sphereToRay) - 1;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return [];
  }

  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  return [Intersection(t1, s), Intersection(t2, s)];
};

/**
 * @param {Ray} r
 * @param {Matrix} m
 * @returns {Ray}
 */
export const transform = (r, m) => {
  return Ray(multiplyTuple(m, r.origin), multiplyTuple(m, r.direction));
};
