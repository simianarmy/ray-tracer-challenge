import { Matrix, multiplyTuple, inverse } from "./matrix";
import { Color } from "./color";
import { sub, add, multiply, magnitude } from "./tuple";

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

  getPatternPoint(localPoint) {
    return multiplyTuple(
      inverse(this.getTransform()),
      localPoint
    );
  }

  /**
   * @param {Shape} object
   * @param {Point} p
   * @returns {Color}
   */
  patternAtShape(object, p) {
    const localPoint = multiplyTuple(inverse(object.getTransform()), p);
    return this.patternAt(localPoint);
  }

  patternAt(p) {
    const pp = this.getPatternPoint(p);
    return Color(pp.x, pp.y, pp.z);
  }
}

export const testPattern = () => {
  return new Pattern();
};

/**
 * Stripe pattern
 * Alternates between 2 patterns
 */
class Stripe extends Pattern {
  constructor(p1, p2) {
    super();
    this.a = p1;
    this.b = p2;
  }
  /**
   * @param {Point} p
   * @returns {Color}
   */
  patternAt(p) {
    const pp = this.getPatternPoint(p);

    if (Math.floor(pp.x) % 2 === 0) {
      return this.a.patternAt(pp);
    } else {
      return this.b.patternAt(pp);
    }
  }
}

/**
 * Gradient pattern
 * Linear gradient between 2 colors
 */
class Gradient extends Pattern {
  constructor(p1, p2) {
    super();
    this.a = p1;
    this.b = p2;
  }

  /**
   * @param {Point} p
   * @returns {Color}
   */
  patternAt(p) {
    const pp = this.getPatternPoint(p);

    const distance = sub(this.b.patternAt(pp), this.a.patternAt(pp));
    const fraction = pp.x - Math.floor(pp.x);

    const res = add(this.a.patternAt(pp), multiply(distance, fraction));
    return Color(res.x, res.y, res.z);
  }
}

/**
 * Radial Gradient pattern
 */
class RadialGradient extends Pattern {
  constructor(p1, p2) {
    super();
    this.a = p1;
    this.b = p2;
  }
  /**
   * @param {Point} p
   * @returns {Color}
   */
  patternAt(p) {
    const pp = this.getPatternPoint(p);

    // gradient calc
    const distance = sub(this.b.patternAt(pp), this.a.patternAt(pp));
    const mag = magnitude(pp);
    const fraction = mag - Math.floor(mag);

    const res = add(this.a.patternAt(pp), multiply(distance, fraction));

    return Color(res.x, res.y, res.z);
  }
}
/**
 * Ring pattern
 * Concentric rings of 2 colors
 */
class Ring extends Pattern {
  constructor(p1, p2) {
    super();
    this.a = p1;
    this.b = p2;
  }

  /**
   * @param {Point} p
   * @returns {Color}
   */
  patternAt(p) {
    const pp = this.getPatternPoint(p);

    if (Math.floor(Math.sqrt(Math.pow(pp.x, 2) + Math.pow(pp.z, 2))) % 2 === 0) {
      return this.a.patternAt(pp);
    } else {
      return this.b.patternAt(pp);
    }
  }
}

/**
 * 3D Checkers pattern
 */
class Checkers extends Pattern {
  constructor(p1, p2) {
    super();
    this.a = p1;
    this.b = p2;
  }

  /**
   * @param {Point} p
   * @returns {Color}
   */
  patternAt(p) {
    const pp = this.getPatternPoint(p);

    if ((Math.floor(pp.x) + Math.floor(pp.y) + Math.floor(pp.z)) % 2 === 0) {
      return this.a.patternAt(pp);
    } else {
      return this.b.patternAt(pp);
    }
  }
}

/**
 * Solid pattern
 */
class SolidPattern extends Pattern {
  constructor(color) {
    super();
    this.a = color;
  }

  patternAt(p) {
    return this.a;
  }
}

/**
 * Nested pattern
 */
class NestedPattern extends Pattern {
  constructor(p1, p2) {
    super();
    this.a = p1;
    this.b = p2;
  }

  patternAt(p) {
  }
}

export { Stripe, Gradient, RadialGradient, Ring, Checkers, SolidPattern };
