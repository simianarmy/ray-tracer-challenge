import { Shape } from "./shape";
import { multiplyTuple } from "./matrix";
import { Bounds } from "./bounds";
import { Cube } from "./cube";
import { BoundingBox } from "./bounding-box";

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

    let bbs = [];

    // convert bounds of children into "group space"
    this.shapes.forEach(shape => {
      //const shapeBounds = shape.boundsInParentSpace();
      const shapeBB = BoundingBox(shape.bounds());

    //  transform all 8 corners of the bounding box
      const transformedBB = shapeBB.corners().map(p => {
        return multiplyTuple(shape.transformation, p);
      });

      bbs.push(transformedBB);
    });

    // TODO: find a single box to contain all corners
    return bounds;
  }
}
