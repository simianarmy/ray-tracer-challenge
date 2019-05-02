import { point, vector, equals } from "./tuple";
import { Ray, position, intersect, transform } from "./ray";
import { Sphere } from "./sphere";
import { scaling, translation } from "./transformations";

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

  describe("transforms", () => {
    it("with translation yields moved ray", () => {
      const r = Ray(point(1, 2, 3), vector(0, 1, 0));
      const m = translation(3, 4, 5);
      const r2 = transform(r, m);
      expect(r2.origin).toEqualPoint(point(4, 6, 8));
      expect(r2.direction).toEqualPoint(vector(0, 1, 0));
    });

    it("with scaling yields scaled ray", () => {
      const r = Ray(point(1, 2, 3), vector(0, 1, 0));
      const m = scaling(2, 3, 4);
      const r2 = transform(r, m);
      expect(r2.origin).toEqualPoint(point(2, 6, 12));
      expect(r2.direction).toEqualPoint(vector(0, 3, 0));
    });
  });
});
