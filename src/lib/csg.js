import { Shape } from "./shape";
import { Group } from "./group";

export const makeCsg = (operation, left, right) => {
  return new Csg({operation, left, right});
};

/**
 * @param {Shape} a
 * @param {Shape} b
 * @returns {Boolean} iff shape A includes shape B
 */
function objectIncludes(a, b) {
  if (a instanceof Group) {
    return a.shapes.any(shape => {
      return objectIncludes(shape, b);
    });
  } else if (a instanceof Csg) {
    return objectIncludes(a.left, b) ||
      objectIncludes(a.right, b);
  } else {
    return a == b;
  }
}

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

  /**
   * @param {Array[Intersection]}
   * @returns {Array[Intersection]}
   */
  filterIntersections(xs) {
    let inl = false;
    let inr = false;

    return xs.filter(is => {
      let isAllowed = false;
      // If is.object is part of the "left" child
      const lhit = objectIncludes(this.left, is.object);

      if (Csg.intersectionAllowed(this.operation, lhit, inl, inr)) {
        isAllowed = true;
      }

      // depending on which object was hit, toggle either inl or inr
      if (lhit) {
        inl = !inl;
      } else {
        inr = !inr;
      }

      return isAllowed;
    });
  }

  localIntersect(ray) {
    const leftXs = this.left.localIntersect(ray);
    console.log("left xs", leftXs);
    const rightXs = this.right.localIntersect(ray);
    console.log("right xs", rightXs);
    const xs = leftXs.concat(rightXs).sort((a, b) => a.t < b.t ? -1 : a.t > b.t ? 1 : 0);

    return this.filterIntersections(xs);
  }
}

export { Csg };
