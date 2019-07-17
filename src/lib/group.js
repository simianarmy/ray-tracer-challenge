import { Shape } from "./shape";
import { multiplyTuple } from "./matrix";
import { Bounds } from "./bounds";
import { Cube } from "./cube";
import { BoundingBox } from "./bounding-box";
import { point } from "./tuple";

export class Group extends Shape {
  constructor(props) {
    super(props);

    this.shapes = [];
    this.boundingBox = new Cube();
  }

  addChild(shape) {
    shape.parent = this;
    this.shapes.push(shape);
  }

  localNormalAt(p) {
    throw new Error("Illegal operation on a Group");
  }

  localIntersect(ray) {
    // OPTIMIZATION
    // TODO: First test the ray against the group's bounding box
    // if (boundingBox.intersect(ray)) {
    // }
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
