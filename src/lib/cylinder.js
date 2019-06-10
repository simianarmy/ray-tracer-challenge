import { Shape } from "./shape";
import { EPSILON } from "./math";
import { Intersection } from "./intersection";
import { vector } from "./tuple";

class Cylinder extends Shape {
  localIntersect(ray) {
    const a = Math.pow(ray.direction.x, 2) + Math.pow(ray.direction.z, 2);

    // if ray is parallel to the y axis
    if (Math.abs(a) < EPSILON) {
      return [];
    }

    const b = (2 * ray.origin.x * ray.direction.x) +
      (2 * ray.origin.z * ray.direction.z);
    const c = Math.pow(ray.origin.x, 2) + Math.pow(ray.origin.z, 2) - 1;
    const disc = b * b - 4 * a * c;

    if (disc < 0) {
      return [];
    }

    const t0 = (-b - Math.sqrt(disc)) / (2 * a);
    const t1 = (-b + Math.sqrt(disc)) / (2 * a);

    return [Intersection(t0, this), Intersection(t1, this)];
  }

  localNormalAt(p) {
    return vector(p.x, 0, p.z);
  }
}

export { Cylinder }
