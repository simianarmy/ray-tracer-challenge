import { dot, point, sub } from "./tuple";
import { Shape } from "./shape";
import { Intersection } from "./intersection";


class Sphere extends Shape {
  /**
   * Calculates intersections of a sphere with a ray
   * @param {Ray} r
   * @returns {Array[Intersection]}
   */
  localIntersect(r) {
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

    return [Intersection(t1, this), Intersection(t2, this)];
  }

  localNormalAt(p, i) {
    return sub(p, point(0, 0, 0));
  }
}

/**
 * Glass sphere constructor
 */
Sphere.Glass = () => {
  let s = new Sphere();
  s.material.transparency = 1;
  s.material.refractiveIndex = 1.5;

  return s;
};

export { Sphere };

