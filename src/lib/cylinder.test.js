import { Cylinder } from "./cylinder";
import { point, vector, normalize } from "./tuple";
import { Ray } from "./ray";
import { floatIsEqual } from "./math";

describe("Cylinder", () => {
  let shape;

  beforeEach(() => {
    shape = new Cylinder();
  });

  describe("ray intersection", () => {
    it("should detect non-intersection", () => {
      const testCases = [
        {origin: point(1, 0, 0), direction: vector(0, 1, 0)},
        {origin: point(0, 0, 0), direction: vector(0, 1, 0)},
        {origin: point(0, 0, -5), direction: vector(1, 1, 1)},
      ];
      testCases.forEach(t => {
        const dir = normalize(t.direction);
        const ray = Ray(t.origin, dir);
        const xs = shape.localIntersect(ray);
        expect(xs.length).toBe(0);
      });
    });

    it("should detect intersections", () => {
      const testCases = [
        {origin: point(1, 0, -5), direction: vector(0, 0, 1), t0: 5, t1: 5},
        {origin: point(0, 0, -5), direction: vector(0, 0, 1), t0: 4, t1: 6},
        {origin: point(0.5, 0, -5), direction: vector(0.1, 1, 1), t0: 6.80798, t1: 7.08872},
      ];
      testCases.forEach(t => {
        const ray = Ray(t.origin, normalize(t.direction));
        const xs = shape.localIntersect(ray);
        expect(xs.length).toBe(2);
        expect(floatIsEqual(xs[0].t, t.t0)).toBeTruthy();
        expect(floatIsEqual(xs[1].t, t.t1)).toBeTruthy();
      });
    });
  });

  describe("normal", () => {
    it("should be computed", () => {
      const testCases = [
        {point: point(1, 0, 0), normal: vector(1, 0, 0)},
        {point: point(0, 5, -1), normal: vector(0, 0, -1)},
        {point: point(0, -2, 1), normal: vector(0, 0, 1)},
        {point: point(-1, 1, 0), normal: vector(-1, 0, 0)},
      ];
      testCases.forEach(t => {
        expect(shape.localNormalAt(t.point)).toEqualVector(t.normal);
      });
    });
  });
});

