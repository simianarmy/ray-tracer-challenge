import { Triangle } from "./triangle";
import { point, vector } from "./tuple";
import { Ray } from "./ray";

const p1 = point(0, 1, 0);
const p2 = point(-1, 0, 0);
const p3 = point(1, 0, 0);
const triangle = () => new Triangle(p1, p2, p3);

describe("Triangle", () => {
  it("given 3 points should initialize 2 edge vectors an a normal", () => {
    const t = triangle();
    expect(t.p1).toEqualPoint(p1);
    expect(t.p2).toEqualPoint(p2);
    expect(t.p3).toEqualPoint(p3);
    expect(t.e1).toEqualVector(vector(-1, -1, 0));
    expect(t.e2).toEqualVector(vector(1, -1, 0));
    expect(t.normal).toEqualVector(vector(0, 0, -1));
  });

  it("should calculate normal at any point", () => {
    const t = triangle();
    expect(t.localNormalAt(point(0, 0.5, 0))).toEqualVector(t.normal);
    expect(t.localNormalAt(point(-0.5, 0.75, 0))).toEqualVector(t.normal);
    expect(t.localNormalAt(point(0.5, 0.25, 0))).toEqualVector(t.normal);
  });

  describe("ray intersections", () => {
    it("ray parallel to triangle", () => {
      const t = triangle();
      const ray = Ray(point(0, -1, -2), vector(0, 1, 0));
      const xs = t.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("ray misses p1-p3 edge", () => {
      const t = triangle();
      const ray = Ray(point(1, 1, -2), vector(0, 0, 1));
      const xs = t.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("ray misses p1-p2 edge", () => {
      const t = triangle();
      const ray = Ray(point(-1, 1, -2), vector(0, 0, 1));
      const xs = t.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("ray misses p2-p3 edge", () => {
      const t = triangle();
      const ray = Ray(point(0, -1, -2), vector(0, 0, 1));
      const xs = t.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("detects ray intersection", () => {
      const t = triangle();
      const ray = Ray(point(0, 0.5, -2), vector(0, 0, 1));
      const xs = t.localIntersect(ray);
      expect(xs.length).toEqual(1);
      expect(xs[0].t).toEqual(2);
    });
  });
});
