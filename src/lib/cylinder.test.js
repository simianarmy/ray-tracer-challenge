import { Cylinder } from "./cylinder";
import { point, vector, normalize } from "./tuple";
import { Ray } from "./ray";
import { floatIsEqual } from "./math";

describe("Cylinder", () => {
  let shape;

  beforeEach(() => {
    shape = new Cylinder();
  });

  it("should be open by default", () => {
    expect(shape.closed).not.toBeTruthy();
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

    describe("on constrained cylinder", () => {
      beforeEach(() => {
        shape.minimum = 1;
        shape.maximum = 2;
      });

      it("should detect intersections", () => {
        const testCases = [
          {origin: point(0, 1.5, 0), direction: vector(0.1, 1, 0), count: 0},
          {origin: point(0, 3, -5), direction: vector(0, 0, 1), count: 0},
          {origin: point(0, 0, -5), direction: vector(0, 0, 1), count: 0},
          {origin: point(0, 2, -5), direction: vector(0, 0, 1), count: 0},
          {origin: point(0, 1, -5), direction: vector(0, 0, 1), count: 0},
          {origin: point(0, 1.5, -2), direction: vector(0, 0, 1), count: 2},
        ];
        testCases.forEach(t => {
          const ray = Ray(t.origin, normalize(t.direction));
          const xs = shape.localIntersect(ray);
          expect(xs.length).toBe(t.count);
        });
      });

      it("should detect intersection with caps of closed cylinder", () => {
        shape.closed = true;

        const testCases = [
          {origin: point(0, 3, 0), direction: vector(0, -1, 0), count: 2},
          {origin: point(0, 3, -2), direction: vector(0, -1, 2), count: 2},
          {origin: point(0, 4, -2), direction: vector(0, -1, 1), count: 2},
          {origin: point(0, 0, -2), direction: vector(0, 1, 2), count: 2},
          {origin: point(0, -1, -2), direction: vector(0, 1, 1), count: 2},
        ];
        testCases.forEach(t => {
          const ray = Ray(t.origin, normalize(t.direction));
          const xs = shape.localIntersect(ray);
          expect(xs.length).toBe(t.count);
        });
      });
    });
  });

  describe("normal", () => {
    it("should be computed for points on surface", () => {
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

    it("should be computed for points on closed cyclinder caps", () => {
      shape.closed = true;
      shape.minimum = 1;
      shape.maximum = 2;

      const testCases = [
        {point: point(0, 1, 0), normal: vector(0, -1, 0)},
        {point: point(0.5, 1, 0), normal: vector(0, -1, 0)},
        {point: point(0, 1, 0.5), normal: vector(0, -1, 0)},
        {point: point(0, 2, 0), normal: vector(0, 1, 0)},
        {point: point(0.5, 2, 0), normal: vector(0, 1, 0)},
        {point: point(0, 2, 0.5), normal: vector(0, 1, 0)},
      ];
      testCases.forEach(t => {
        expect(shape.localNormalAt(t.point)).toEqualVector(t.normal);
      });
    });
  });

  describe("bounds", () => {
    it("should have infinite minimum and maximum bounds", () => {
      expect(shape.minimum).toBe(Number.NEGATIVE_INFINITY);
      expect(shape.maximum).toBe(Number.POSITIVE_INFINITY);
    });
  });
});

