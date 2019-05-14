import { Stripe, stripeAt, stripeAtObject } from "./pattern";
import { Color } from "./color";
import { point } from "./tuple";
import { Sphere } from "./sphere";
import { scaling, translation } from "./transformations";

describe("Patterns", () => {
  let pattern;

  describe("Stripe", () => {
    beforeEach(() => {
      pattern = Stripe(Color.White, Color.Black);
    });

    describe("creating", () => {
      it("should store 2 colors", () => {
        expect(pattern.a).toEqual(Color.White);
        expect(pattern.b).toEqual(Color.Black);
      });
    });

    describe("stripeAt", () => {
      it("should be constant in y", () => {
        expect(stripeAt(pattern, point(0, 0, 0))).toEqual(Color.White);
        expect(stripeAt(pattern, point(0, 1, 0))).toEqual(Color.White);
        expect(stripeAt(pattern, point(0, 2, 0))).toEqual(Color.White);
      });

      it("should be constant in z", () => {
        expect(stripeAt(pattern, point(0, 0, 0))).toEqual(Color.White);
        expect(stripeAt(pattern, point(0, 0, 1))).toEqual(Color.White);
        expect(stripeAt(pattern, point(0, 0, 2))).toEqual(Color.White);
      });

      it("should alternate in x", () => {
        expect(stripeAt(pattern, point(0, 0, 0))).toEqual(Color.White);
        expect(stripeAt(pattern, point(0.9, 0, 0))).toEqual(Color.White);
        expect(stripeAt(pattern, point(1, 0, 0))).toEqual(Color.Black);
        expect(stripeAt(pattern, point(-.1, 0, 0))).toEqual(Color.Black);
        expect(stripeAt(pattern, point(-1, 0, 0))).toEqual(Color.Black);
        expect(stripeAt(pattern, point(-1.1, 0, 0))).toEqual(Color.White);
      });
    });

    describe("stripeAtObject", () => {
      it("should work with object transformation", () => {
        const object = new Sphere();
        object.setTransform(scaling(2, 2, 2));
        const c = stripeAtObject(pattern, object, point(1.5, 0, 0));
        expect(c).toEqualColor(Color.White);
      });

      it("should work with pattern transformation", () => {
        const object = new Sphere();
        pattern.setTransform(scaling(2, 2, 2));
        const c = stripeAtObject(pattern, object, point(1.5, 0, 0));
        expect(c).toEqualColor(Color.White);
      });

      it("should work with object and pattern transformations", () => {
        const object = new Sphere();
        object.setTransform(scaling(2, 2, 2));
        pattern.setTransform(translation(0.5, 0, 0));
        const c = stripeAtObject(pattern, object, point(2.5, 0, 0));
        expect(c).toEqualColor(Color.White);
      });
    });
  });
});
