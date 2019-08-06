import { Shape } from "./shape";
import { sub, normalize, cross, dot } from "./tuple";
import { isZero } from "./math";
import { Intersection } from "./intersection";

export class Triangle extends Shape {
  constructor(p1, p2, p3) {
    super();

    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.e1 = sub(p2, p1);
    this.e2 = sub(p3, p1);
    this.normal = normalize(cross(this.e2, this.e1));
  }

  localNormalAt(p, i) {
    return this.normal;
  }

  /**
   * Calculates t, u, and v for the localIntersect function
   * @returns {Object} if intersection found, null if not
   */
  localIntersectHelper(ray) {
    // Muller-Trumbore algorithm
    const dirCrossE = cross(ray.direction, this.e2);
    const det = dot(this.e1, dirCrossE);

    if (isZero(det)) {
      return null;
    }

    const f = 1.0 / det;
    const p1ToOrigin = sub(ray.origin, this.p1);
    const u = f * dot(p1ToOrigin, dirCrossE);

    if (u < 0 || u > 1) {
      return null;
    }

    const originCrossE1 = cross(p1ToOrigin, this.e1);
    const v = f * dot(ray.direction, originCrossE1);

    if (v < 0 || (u + v) > 1) {
      return null;
    }

    const t = f * dot(this.e2, originCrossE1);

    return {
      t,
      u,
      v
    }
  }

  localIntersect(ray) {
    const res = this.localIntersectHelper(ray); // ugh

    if (res) {
      return [Intersection(res.t, this)];
    }

    return [];
  }
}

