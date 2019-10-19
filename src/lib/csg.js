import { Shape } from "./shape";

export const makeCsg = (operation, left, right) => {
  return new Csg({operation, left, right});
};

class Csg extends Shape {
  static Union = "union";
  static Intersection = "intersection";
  static Difference = "difference";

  static intersectionAllowed(op, lhit, inl, inr) {
    switch (op) {
      case Csg.Union:
        return (lhit && !inr) || (!lhit && !inl);
      case Csg.Intersection:
        return (lhit && inr) || (!lhit && inl);
      case Csg.Difference:
        return (lhit && !inr) || (!lhit && inl);
      default:
        return false;
    }
  }

  constructor(props) {
    super(props);
    this.operation = props.operation;
    this.left = props.left;
    this.right = props.right;
    this.left.parent = this;
    this.right.parent = this;
  }
}

export { Csg };
