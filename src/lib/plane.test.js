import { Plane } from "./plane";
import { point, vector } from "./tuple";
import { Ray } from "./ray";

describe("Plane", () => {
  it("should have constand normal everywhere", () => {
    const pl = new Plane();
    const n1 = pl.localNormalAt(point(0, 0, 0));
    const n2 = pl.localNormalAt(point(-10, 0, -10));
    const n3 = pl.localNormalAt(point(-5, 0, 150));
    const expected = vector(0, 1, 0);
    expect(n1).toEqualTuple(expected);
    expect(n2).toEqualTuple(expected);
    expect(n3).toEqualTuple(expected);
  });

  describe("ray intersect", () => {
    let plane, ray;

    beforeEach(() => {
      plane = new Plane();
    });

    it("should never intersect when ray is parallel to plane", () => {
      ray = Ray(point(0, 10, 0), vector(0, 0, 1))
      const xs = plane.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("should never intersect when ray is coplanar", () => {
      ray = Ray(point(0, 0, 0), vector(0, 0, 1));
      const xs = plane.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("should intersect with a ray from above", () => {
      ray = Ray(point(0, 1, 0), vector(0, -1, 0));
      const xs = plane.localIntersect(ray);
      expect(xs.length).toBe(1);
      expect(xs[0].t).toBe(1);
      expect(xs[0].object).toEqual(plane);
    });

    it("should intersect with a ray from below", () => {
      ray = Ray(point(0, -1, 0), vector(0, 1, 0));
      const xs = plane.localIntersect(ray);
      expect(xs.length).toBe(1);
      expect(xs[0].t).toBe(1);
      expect(xs[0].object).toEqual(plane);
    });
  });
});
