import { testPattern, Stripe } from "./pattern";
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

  describe("atShape", () => {
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
      pattern = new Stripe(Color.White, Color.Black);
    });

    describe("creating", () => {
      it("should store 2 colors", () => {
        expect(pattern.a).toEqual(Color.White);
        expect(pattern.b).toEqual(Color.Black);
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
});
