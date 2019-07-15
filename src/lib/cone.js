import { Shape } from "./shape";
import { EPSILON } from "./math";
import { Intersection } from "./intersection";
import { vector } from "./tuple";
import { Bounds } from "./bounds";

// intersection helpers
// checks to see if the intersection at `t` is within the radius of the cone
const checkCap = (ray, t, y) => {
  const x = ray.origin.x + t * ray.direction.x;
  const z = ray.origin.z + t * ray.direction.z;

  return x * x + z * z <= Math.abs(y);
};

class Cone extends Shape {
  constructor(props) {
    super(props);
    this.minimum = Number.NEGATIVE_INFINITY;
    this.maximum = Number.POSITIVE_INFINITY;
    this.closed = false;
  }

  localIntersect(ray) {
    const a =
      Math.pow(ray.direction.x, 2) -
      Math.pow(ray.direction.y, 2) +
      Math.pow(ray.direction.z, 2);
    const b =
      2 * ray.origin.x * ray.direction.x -
      2 * ray.origin.y * ray.direction.y +
      2 * ray.origin.z * ray.direction.z;
    const c =
      Math.pow(ray.origin.x, 2) -
      Math.pow(ray.origin.y, 2) +
      Math.pow(ray.origin.z, 2);

    // if ray is parallel to the y axis
    if (Math.abs(a) < EPSILON) {
      if (Math.abs(b) < EPSILON) {
        return [];
      }

      const t = -c / (2 * b);
      const xs = [Intersection(t, this)];

      return this.intersectCaps(ray, xs);
    }

    const disc = b * b - 4 * a * c;

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

  localNormalAt(p) {
    const dist = p.x * p.x + p.z * p.z;

    if (dist < 1 && p.y >= this.maximum - EPSILON) {
      return vector(0, 1, 0);
    } else if (dist < 1 && p.y <= this.minimum + EPSILON) {
      return vector(0, -1, 0);
    }

    let y = Math.sqrt(p.x * p.x + p.z * p.z);

    if (p.y > 0) {
      y = -y;
    }

    return vector(p.x, y, p.z);
  }

  /**
   * @modifies xs
   */
  intersectCaps(ray, xs) {
    if (!this.closed || Math.abs(ray.direction.y) < EPSILON) {
      return xs;
    }

    // check for intersection with lower cap
    let t = (this.minimum - ray.origin.y) / ray.direction.y;

    if (checkCap(ray, t, this.minimum)) {
      xs.push(Intersection(t, this));
    }

    // check for intersection with upper cap
    t = (this.maximum - ray.origin.y) / ray.direction.y;

    if (checkCap(ray, t, this.maximum)) {
      xs.push(Intersection(t, this));
    }

    return xs;
  }

  bounds() {
    let bounds = Bounds();

    bounds.min.y = this.minimum;
    bounds.max.y = this.maximum;

    bounds.min.x = bounds.min.y = -Math.max(Math.abs(bounds.min.y), Math.abs(bounds.max.y));
    bounds.max.x = bounds.max.y = Math.max(Math.abs(bounds.min.y), Math.abs(bounds.max.y));
    return bounds;
  }
}

export { Cone };
