import { Shape } from "./shape";
import { EPSILON } from "./math";
import { Intersection } from "./intersection";
import { vector } from "./tuple";
import { Bounds } from "./bounds";

// intersection helpers
// checks to see if the intersection at `t` is within a radius
// of 1 (the radius of your cylinders) from the y axis.
const checkCap = (ray, t) => {
  const x = ray.origin.x + t * ray.direction.x;
  const z = ray.origin.z + t * ray.direction.z;

  return (x * x + z * z) <= 1;
}

class Cylinder extends Shape {
  constructor(props) {
    super(props);
    this.minimum = Number.NEGATIVE_INFINITY;
    this.maximum = Number.POSITIVE_INFINITY;
    this.closed = false;
  }

  localIntersect(ray) {
    const a = Math.pow(ray.direction.x, 2) + Math.pow(ray.direction.z, 2);

    // if ray is parallel to the y axis
    if (Math.abs(a) < EPSILON) {
      return this.intersectCaps(ray, []);
    }

    const b = (2 * ray.origin.x * ray.direction.x) +
      (2 * ray.origin.z * ray.direction.z);
    const c = Math.pow(ray.origin.x, 2) + Math.pow(ray.origin.z, 2) - 1;
    const disc = b * b - 4 * a * c;

    if (disc < 0) {
      return [];
    }

    let t0 = (-b - Math.sqrt(disc)) / (2 * a);
    let t1 = (-b + Math.sqrt(disc)) / (2 * a);

    if (t0 > t1) {
      const temp = t0;
      t0 = t1;
      t1 = temp;
    }

    let xs = [t0, t1].reduce((acc, curr) => {
      const y = ray.origin.y + curr * ray.direction.y;

      if (this.minimum < y && y < this.maximum) {
        acc.push(Intersection(curr, this));
      }
      return acc;
    }, []);

    return this.intersectCaps(ray, xs);
  }

  localNormalAt(p, i) {
    const dist = p.x * p.x + p.z * p.z;

    if (dist < 1 && p.y >= this.maximum - EPSILON) {
      return vector(0, 1, 0);
    } else if (dist < 1 && p.y <= this.minimum + EPSILON) {
      return vector(0, -1, 0);
    }

    return vector(p.x, 0, p.z);
  }

  /**
   * @modifies xs
   */
  intersectCaps(ray, xs) {
    if (!this.closed || (Math.abs(ray.direction.y) < EPSILON)) {
      return xs;
    }

    // check for intersection with lower cap
    let t = (this.minimum - ray.origin.y) / ray.direction.y;

    if (checkCap(ray, t)) {
      xs.push(Intersection(t, this));
    }

    // check for intersection with upper cap
    t = (this.maximum - ray.origin.y) / ray.direction.y;

    if (checkCap(ray, t)) {
      xs.push(Intersection(t, this));
    }

    return xs;
  }

  bounds() {
    let bounds = Bounds();

    bounds.min.y = this.minimum;
    bounds.max.y = this.maximum;

    return bounds;
  }
}

export { Cylinder }
