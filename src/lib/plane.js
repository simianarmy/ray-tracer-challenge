import { Shape } from "./shape";
import { vector } from "./tuple";
import { EPSILON } from "./math";
import { Intersection } from "./intersection";
import { Bounds } from "./bounds";

class Plane extends Shape {
  localNormalAt(p, i) {
    return vector(0, 1, 0);
  }

  localIntersect(ray) {
    if (Math.abs(ray.direction.y) < EPSILON) {
      return [];
    }

    const t = -ray.origin.y / ray.direction.y;

    return [Intersection(t, this)];
  }

  bounds() {
    let bounds = Bounds();

    bounds.min.x = Number.NEGATIVE_INFINITY;
    bounds.min.z = Number.NEGATIVE_INFINITY;
    bounds.max.x = Number.POSITIVE_INFINITY;
    bounds.max.z = Number.POSITIVE_INFINITY;
  }
}

export { Plane }
