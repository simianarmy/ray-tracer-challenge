import { Matrix, multiplyTuple, inverse } from "./matrix";
import { Color } from "./color";
import { point, sub, add, divide, multiply, magnitude } from "./tuple";
import { perlin } from "./math";

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

class Blended extends Pattern {
  constructor(p1, p2) {
    super();
    this.p1 = p1;
    this.p2 = p2;
  }

  patternAt(p) {
    const pp = this.getPatternPoint(p);
    const c1 = this.p1.patternAt(pp);
    const c2 = this.p2.patternAt(pp);
    const avg = divide(add(c1, c2), 2);

    return Color(avg.x, avg.y, avg.z);
  }
}

class Perturbed extends Pattern {
  constructor(p) {
    super();
    this.p1 = p;
    this.scaleFactor = 4;
  }

  patternAt(p) {
    const pp = this.getPatternPoint(p);
    const noiseX = perlin(pp.x, pp.y + 0.1, pp.z + .1) * this.scaleFactor;
    const noiseY = perlin(pp.x, pp.y + 0.2, pp.z + 1.1) * this.scaleFactor;
    const noiseZ = perlin(pp.x, pp.y + 0.3, pp.z + 2.1) * this.scaleFactor;

    //console.log("perturbed ", pp, noiseX, noiseY, noiseZ);
    return this.p1.patternAt(point(pp.x + noiseX, pp.y + noiseY, pp.z + noiseZ));
  }
}

export { Stripe, Gradient, RadialGradient, Ring, Checkers, Blended, SolidPattern, Perturbed };
