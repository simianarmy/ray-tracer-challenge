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
}
