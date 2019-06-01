import { testPattern, Stripe, Gradient, RadialGradient, Ring, Checkers, Blended, SolidPattern, Perturbed } from "./pattern";
import { Color } from "./color";
import { point } from "./tuple";
import { Sphere } from "./sphere";
import { scaling, translation } from "./transformations";
import { Matrix } from "./matrix";

describe("Patterns", () => {
  let pattern;

  describe("default pattern", () => {
    it("should have transformation set as the identity matrix", () => {
      pattern = testPattern();
      expect(pattern.getTransform()).toEqualMatrix(Matrix.identity);
    });
  });

  it("should have assignable transformation", () => {
    pattern = testPattern();
    const t = translation(1, 2, 3);
    pattern.setTransform(t);
    expect(pattern.getTransform()).toEqualMatrix(t);
  });

  describe("patternAtShape", () => {
    beforeEach(() => {
      pattern = testPattern();
    });

    it("should work with object transformation", () => {
      const object = new Sphere();
      object.setTransform(scaling(2, 2, 2));
      const c = pattern.patternAtShape(object, point(2, 3, 4));
      expect(c).toEqualColor(Color(1, 1.5, 2));
    });

    it("should work with pattern transformation", () => {
      const object = new Sphere();
      pattern.setTransform(scaling(2, 2, 2));
      const c = pattern.patternAtShape(object, point(2, 3, 4));
      expect(c).toEqualColor(Color(1, 1.5, 2));
    });

    it("should work with object and pattern transformations", () => {
      const object = new Sphere();
      object.setTransform(scaling(2, 2, 2));
      pattern.setTransform(translation(0.5, 1, 1.5));
      const c = pattern.patternAtShape(object, point(2.5, 3, 3.5));
      expect(c).toEqualColor(Color(0.75, 0.5, 0.25));
    });
  });

  describe("Stripe", () => {
    beforeEach(() => {
      pattern = new Stripe(new SolidPattern(Color.White), new SolidPattern(Color.Black));
    });

    describe("creating", () => {
      it("should store 2 colors", () => {
        const p0 = point(0, 0, 0);
        expect(pattern.a.patternAt(p0)).toEqual(Color.White);
        expect(pattern.b.patternAt(p0)).toEqual(Color.Black);
      });
    });

    describe("stripeAt", () => {
      it("should be constant in y", () => {
        expect(pattern.patternAt(point(0, 0, 0))).toEqual(Color.White);
        expect(pattern.patternAt(point(0, 1, 0))).toEqual(Color.White);
        expect(pattern.patternAt(point(0, 2, 0))).toEqual(Color.White);
      });

      it("should be constant in z", () => {
        expect(pattern.patternAt(point(0, 0, 0))).toEqual(Color.White);
        expect(pattern.patternAt(point(0, 0, 1))).toEqual(Color.White);
        expect(pattern.patternAt(point(0, 0, 2))).toEqual(Color.White);
      });

      it("should alternate in x", () => {
        expect(pattern.patternAt(point(0, 0, 0))).toEqual(Color.White);
        expect(pattern.patternAt(point(0.9, 0, 0))).toEqual(Color.White);
        expect(pattern.patternAt(point(1, 0, 0))).toEqual(Color.Black);
        expect(pattern.patternAt(point(-0.1, 0, 0))).toEqual(Color.Black);
        expect(pattern.patternAt(point(-1, 0, 0))).toEqual(Color.Black);
        expect(pattern.patternAt(point(-1.1, 0, 0))).toEqual(Color.White);
      });
    });
  });

  describe("Gradient", () => {
    beforeEach(() => {
      pattern = new Gradient(new SolidPattern(Color.White), new SolidPattern(Color.Black));
    });

    it("should linearly interpolate between colors", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(0.25, 0, 0))).toEqualColor(
        Color(0.75, 0.75, 0.75)
      );
      expect(pattern.patternAt(point(0.5, 0, 0))).toEqualColor(
        Color(0.5, 0.5, 0.5)
      );
      expect(pattern.patternAt(point(0.75, 0, 0))).toEqualColor(
        Color(0.25, 0.25, 0.25)
      );
    });
  });

  describe("Ring", () => {
    beforeEach(() => {
      pattern = new Ring(new SolidPattern(Color.White), new SolidPattern(Color.Black));
    });

    it("should extend in both x and z", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(1, 0, 0))).toEqualColor(Color.Black);
      expect(pattern.patternAt(point(0, 0, 1))).toEqualColor(Color.Black);
      expect(pattern.patternAt(point(0.708, 0, 0.708))).toEqualColor(
        Color.Black
      );
    });
  });

  describe("Checkers", () => {
    beforeEach(() => {
      pattern = new Checkers(new SolidPattern(Color.White), new SolidPattern(Color.Black));
    });

    it("should repeat in x", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(0.99, 0, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(1.01, 0, 0))).toEqualColor(Color.Black);
    });

    it("should repeat in y", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(0, 0.99, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(0, 1.01, 0))).toEqualColor(Color.Black);
    });

    it("should repeat in z", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(0, 0, 0.99))).toEqualColor(Color.White);
      expect(pattern.patternAt(point(0, 0, 1.01))).toEqualColor(Color.Black);
    });
  });

  describe("RadialGradient", () => {
    beforeEach(() => {
      pattern = new RadialGradient(new SolidPattern(Color.White), new SolidPattern(Color.Black));
    });

    it("should linearly interpolate between colors", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color.White);
      let received = pattern.patternAt(point(0.25, 0.5, 0));
      const expected = Color(0.8543560, 0.8543560, 0.8543560);
      expect(received).toEqualColor(expected);
      received = pattern.patternAt(point(0.5, 0, 0));
      expect(received).toEqualColor(
        Color(0.8819660, 0.8819660, 0.8819660)
      );
    });
  });

  describe("Blended", () => {
    beforeEach(() => {
      pattern = new Blended(new SolidPattern(Color.White), new SolidPattern(Color.Black));
    });

    it("should blend colors of 2 patterns", () => {
      expect(pattern.patternAt(point(0, 0, 0))).toEqualColor(Color(0.5, 0.5, 0.5));
      expect(pattern.patternAt(point(1, 1, 1))).toEqualColor(Color(0.5, 0.5, 0.5));
    });
  });

  describe("Perturbed", () => {
    beforeEach(() => {
      pattern == new Gradient(new SolidPattern(Color.White), new SolidPattern(Color.Blue));
    });

    it("should change pattern colors by a small fraction", () => {
      const perturbed = new Perturbed(pattern);
      const c = pattern.patternAt(point(0.5, 0.5, 0.5));
      const pc = perturbed.patternAt(point(0.5, 0.5, 0.5));
      expect(pc).not.toEqualColor(c);
    });
  });
});
