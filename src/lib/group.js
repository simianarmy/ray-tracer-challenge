import { Shape } from "./shape";
import { multiplyTuple } from "./matrix";
import { Bounds } from "./bounds";
import { Cube } from "./cube";
import { BoundingBox } from "./bounding-box";
import { point } from "./tuple";
import { checkAxis } from "./math";

const ENABLE_BOUNDING_BOX = false;

export class Group extends Shape {
  constructor(props) {
    super(props);

    this.shapes = [];
    this.boundingBox = null;
  }

  addChild(shape) {
    shape.parent = this;
    this.shapes.push(shape);
  }

  localNormalAt(p) {
    throw new Error("Illegal operation on a Group");
  }

  localIntersect(ray) {
    if (ENABLE_BOUNDING_BOX) {
      // OPTIMIZATION
      // First test the ray against the group's bounding box
      const bb = this.bounds();

      const [xtmin, xtmax] = checkAxis(ray.origin.x, ray.direction.x, bb.min.x, bb.max.x);
      const [ytmin, ytmax] = checkAxis(ray.origin.y, ray.direction.y, bb.min.y, bb.max.y);
      const [ztmin, ztmax] = checkAxis(ray.origin.z, ray.direction.z, bb.min.z, bb.max.z);

      const tmin = Math.max(xtmin, ytmin, ztmin);
      const tmax = Math.min(xtmax, ytmax, ztmax);

      // only if ray intersects bounding box should ray be tested against
      // children
      if (tmin > tmax) {
        return [];
      }
    }

    const intersections = this.shapes.reduce((acc, shape) => {
      return acc.concat(shape.intersect(ray));
    }, []);

    // sort by t
    return intersections.sort((a, b) => a.t < b.t ? -1 : a.t > b.t ? 1 : 0);
  }

  bounds() {
    let bounds = Bounds();

    if (this.shapes.length === 0) {
      return bounds;
    }

    let xs = [], ys = [], zs = [];

    // convert bounds of children into "group space"
    this.shapes.forEach(shape => {
      //const shapeBounds = shape.boundsInParentSpace();
      const shapeBB = BoundingBox(shape.bounds());
      //console.log("shapeBB", shapeBB);

      // transform all 8 corners of the bounding box
      const transformedBB = shapeBB.corners.map(p => {
        // Don't try to multiply by infinity
        if (Math.abs(p.x) === Number.POSITIVE_INFINITY ||
          Math.abs(p.y) === Number.POSITIVE_INFINITY ||
          Math.abs(p.z) === Number.POSITIVE_INFINITY) {
          return p;
        }
        return multiplyTuple(shape.transformation, p);
      });

      //console.log("transformed bb", transformedBB);
      transformedBB.forEach(tp => {
        xs.push(tp.x);
        ys.push(tp.y);
        zs.push(tp.z);
      });
    });

    let minX, minY, minZ, maxX, maxY, maxZ;

    // find a single box to contain all corners
    minX = Math.min.apply(null, xs);
    minY = Math.min.apply(null, ys);
    minZ = Math.min.apply(null, zs);
    maxX = Math.max.apply(null, xs);
    maxY = Math.max.apply(null, ys);
    maxZ = Math.max.apply(null, zs);

    bounds.min = point(minX, minY, minZ);
    bounds.max = point(maxX, maxY, maxZ);

    return bounds;
  }
}
