import { Shape } from "./shape";

export class Group extends Shape {
  constructor(props) {
    super(props);

    this.shapes = [];
  }

  addChild(shape) {
    shape.parent = this;
    this.shapes.push(shape);
  }

  localNormalAt(p) {
    throw new Error("Illegal operation on a Group");
  }

  localIntersect(ray) {
    const intersections = this.shapes.reduce((acc, shape) => {
      return acc.concat(shape.intersect(ray));
    }, []);

    // sort by t
    return intersections.sort((a, b) => a.t < b.t ? -1 : a.t > b.t ? 1 : 0);
  }
}
