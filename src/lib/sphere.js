import { dot, point, sub } from "./tuple";
import { Shape } from "./shape";
import { Intersection } from "./intersection";

const uuidv1 = require("uuid/v1");

class Sphere extends Shape {
  constructor(props) {
    super(props);
    this.id = uuidv1();
  }

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

  localNormalAt(p) {
    return sub(p, point(0, 0, 0));
  }
}

export { Sphere };

