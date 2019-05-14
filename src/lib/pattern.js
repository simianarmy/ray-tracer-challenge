import { Matrix, multiplyTuple, inverse } from "./matrix";
import { Color } from "./color";

class Pattern {
  constructor() {
    this.transformation = Matrix.identity;
  }

  getTransform() {
    return this.transformation;
  }

  setTransform(t) {
    this.transformation = t;
  }

  /**
   * @param {Shape} object
   * @param {Point} p
   * @returns {Color}
   */
  patternAtShape(object, p) {
    const localPoint = multiplyTuple(inverse(object.getTransform()), p);
    const patternPoint = multiplyTuple(
      inverse(this.getTransform()),
      localPoint
    );

    return this.patternAt(patternPoint);
  }

  patternAt(p) {
    return Color(p.x, p.y, p.z);
  }
}

export const testPattern = () => {
  return new Pattern();
};

class Stripe extends Pattern {
  constructor(c1, c2) {
    super();
    this.a = c1;
    this.b = c2;
  }
  /**
   * @param {Point} p
   * @returns {Color}
   */
  patternAt(p) {
    if (Math.floor(p.x) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

export { Pattern, Stripe };
