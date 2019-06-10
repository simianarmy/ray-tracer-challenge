import { Shape } from "./shape";
import { checkAxis } from "./math";
import { Intersection } from "./intersection";
import { vector } from "./tuple";

class Cube extends Shape {
  localIntersect(r) {
    const [xtmin, xtmax] = checkAxis(r.origin.x, r.direction.x);
    const [ytmin, ytmax] = checkAxis(r.origin.y, r.direction.y);
    const [ztmin, ztmax] = checkAxis(r.origin.z, r.direction.z);

    const tmin = Math.max(xtmin, ytmin, ztmin);
    const tmax = Math.min(xtmax, ytmax, ztmax);

    if (tmin > tmax) {
      return [];
    }

    return [Intersection(tmin, this), Intersection(tmax, this)];
  }

  /**
   * @returns {Vector}
   */
  localNormalAt(point) {
    // find component with largest absolute value
    const maxc = Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z));

    if (maxc === Math.abs(point.x)) {
      return vector(point.x, 0, 0);
    } else if (maxc === Math.abs(point.y)) {
      return vector(0, point.y, 0);
    }
    return vector(0, 0, point.z);
  }
}

export { Cube }
