import { point, vector, equals } from "./tuple";
import { Ray, position, intersect } from "./ray";
import { Sphere } from "./sphere";

expect.extend({
  toEqualPoint(received, expected) {
    const passed = equals(received, expected);

    if (passed) {
      return {
        pass: true,
        message: () => `expected ${received} not to be equal to ${expected}`
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be equal to ${expected}`
      };
    }
  }
});

describe("Ray", () => {
  it("represents point and origin", () => {
    const p = point(1, 2, 3);
    const v = vector(3, 4, 5);
    const r = Ray(p, v);
    expect(r.origin);
    expect(v.direction);
  });

  it("should compute a point from a distance", () => {
    const r = Ray(point(2, 3, 4), vector(1, 0, 0));
    expect(position(r, 0)).toEqualPoint(point(2, 3, 4));
    expect(position(r, 1)).toEqualPoint(point(3, 3, 4));
    expect(position(r, -1)).toEqualPoint(point(1, 3, 4));
    expect(position(r, 2.5)).toEqualPoint(point(4.5, 3, 4));
  });

  describe("intersection with sphere", () => {
    it("should intersect at two points", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const s = Sphere();
      const xs = intersect(s, r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(4.0);
      expect(xs[1].t).toBe(6.0);
    });

    it("at the tangent should intersect at two equal points", () => {
      const r = Ray(point(0, 1, -5), vector(0, 0, 1));
      const s = Sphere();
      const xs = intersect(s, r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(5.0);
      expect(xs[1].t).toBe(5.0);
    });

    it("ray starting inside of sphere should intersect at two points", () => {
      const r = Ray(point(0, 0, 0), vector(0, 0, 1));
      const s = Sphere();
      const xs = intersect(s, r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(-1.0);
      expect(xs[1].t).toBe(1.0);
    });

    it("sphere behind ray should intersect at two points", () => {
      const r = Ray(point(0, 0, 5), vector(0, 0, 1));
      const s = Sphere();
      const xs = intersect(s, r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(-6.0);
      expect(xs[1].t).toBe(-4.0);
    });
  });

  it("not intersecting a sphere should return no intersecting points", () => {
      const r = Ray(point(0, 2, -5), vector(0, 0, 1));
      const s = Sphere();
      const xs = intersect(s, r);
      expect(xs.length).toBe(0);
  });
});
