import { Matrix, multiplyTuple, inverse } from "./matrix";
import { Color } from "./color";
import { sub, add, multiply } from "./tuple";

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

/**
 * Stripe pattern
 * Alternates between 2 colors
 */
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

/**
 * Gradient pattern
 * Linear gradient between 2 colors
 */
class Gradient extends Pattern {
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
    const distance = sub(this.b, this.a);
    const fraction = p.x - Math.floor(p.x);

    const res = add(this.a, multiply(distance, fraction));
    return Color(res.x, res.y, res.z);
  }
}

/**
 * Ring pattern
 * Concentric rings of 2 colors
 */
class Ring extends Pattern {
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
    if (Math.floor(Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.z, 2))) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

/**
 * 3D Checkers pattern
 */
class Checkers extends Pattern {
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
    if ((Math.floor(p.x) + Math.floor(p.y) + Math.floor(p.z)) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

export { Stripe, Gradient, Ring, Checkers };
