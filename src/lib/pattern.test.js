import { Stripe, stripeAt } from "./pattern";
import { Color } from "./color";
import { point } from "./tuple";

describe("Pattern", () => {
  describe("creating stripe", () => {
    it("should store 2 colors", () => {
      const p = Stripe(Color.Black, Color.White);
      expect(p.a).toEqual(Color.Black);
      expect(p.b).toEqual(Color.White);
    });
  });

  describe("stripeAt", () => {
    let pattern;

    beforeEach(() => {
      pattern = Stripe(Color.White, Color.Black);
    });

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
});
