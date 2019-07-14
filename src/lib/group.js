import { Shape } from "./shape";
import { multiplyTuple } from "./matrix";
import { Bounds } from "./bounds";
import { Cube } from "./cube";

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

    // convert bounds of children into "group space"
    this.shapes.forEach(shape => {
      // bounds_in_parent_space(shape)
      const bb = shape.bounds();
      const minPoint = multiplyTuple(shape.transformation, bb.min);
      const maxPoint = multiplyTuple(shape.transformation, bb.max);

      // I think we need to check all 8 corners of the bounding box here?

      if (minPoint.x < bounds.min.x) {
        bounds.min.x = minPoint.x;
      }

      if (minPoint.y < bounds.min.y) {
        bounds.min.y = minPoint.y;
      }

      if (minPoint.z < bounds.min.z) {
        bounds.min.z = minPoint.z;
      }

      if (maxPoint.x > bounds.max.x) {
        bounds.max.x = maxPoint.x;
      }

      if (maxPoint.y > bounds.max.y) {
        bounds.max.y = maxPoint.y;
      }
      if (maxPoint.z > bounds.max.z) {
        bounds.max.z = maxPoint.z;
      }
    });

    // TODO: transform bounding box:
    // TODO: transform all 8 corners of the cube?
    // TODO: find a single box to contain all corners
    return bounds;
  }
}
