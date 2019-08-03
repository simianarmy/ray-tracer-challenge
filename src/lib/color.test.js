import {
  Color as color,
  addColor,
  subtractColor,
  multiplyColor,
  multiplyByScalar
} from "./color";
import { equals } from "./tuple";

describe("Color", () => {
  it("is a (red, green, blue) tuple", () => {
    const c = color(-0.5, 0.4, 1.7);
    expect(c.red).toEqual(-0.5);
    expect(c.green).toEqual(0.4);
    expect(c.blue).toEqual(1.7);
  });

  describe("adding colors", () => {
    it("is the same as adding tuples", () => {
      const c1 = color(0.9, 0.6, 0.75);
      const c2 = color(0.7, 0.1, 0.25);
      const expected = color(1.6, 0.7, 1.0);
      expect(equals(addColor(c1, c2), expected)).toBeTruthy();
    });
  });

  describe("subtracting colors", () => {
    it("is the same as subtracting tuples", () => {
      const c1 = color(0.9, 0.6, 0.75);
      const c2 = color(0.7, 0.1, 0.25);
      const expected = color(0.2, 0.5, 0.5);
      expect(equals(subtractColor(c1, c2), expected)).toBeTruthy();
    });
  });

  describe("multiplying color by a scalar", () => {
    it("is the same as mutiplying tuple with scalar", () => {
      const c = color(0.2, 0.3, 0.4);
      const expected = color(0.4, 0.6, 0.8);
      expect(equals(multiplyByScalar(c, 2), expected)).toBeTruthy();
    });
  });

  describe("multiplying two colors", () => {
    it("yields a new color", () => {
      const c1 = color(1, 0.2, 0.4);
      const c2 = color(0.9, 1, 0.1);
      const expected = color(0.9, 0.2, 0.04);
      expect(equals(multiplyColor(c1, c2), expected)).toBeTruthy();
    });
  });
});
