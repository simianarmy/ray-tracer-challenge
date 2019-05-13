import { Shape } from "./shape";
import { vector } from "./tuple";
import { EPSILON } from "./math";
import { Intersection } from "./intersection";

class Plane {
  localNormalAt() {
    return vector(0, 1, 0);
  }

  localIntersect(ray) {
    if (Math.abs(ray.direction.y) < EPSILON) {
      return [];
    }

    const t = -ray.origin.y / ray.direction.y;

    return [Intersection(t, this)];
  }
}

export { Plane }
