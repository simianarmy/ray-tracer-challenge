import { Cone } from "./cone";
import { point, vector, normalize } from "./tuple";
import { Ray } from "./ray";
import { floatIsEqual } from "./math";

describe("Cone", () => {
  let shape;

  beforeEach(() => {
    shape = new Cone();
  });

  it("should be open by default", () => {
    expect(shape.closed).not.toBeTruthy();
  });

  describe("ray intersection", () => {
    xit("should detect non-intersection", () => {
      const testCases = [
        { origin: point(1, 0, 0), direction: vector(0, 1, 0) },
        { origin: point(0, 0, 0), direction: vector(0, 1, 0) },
        { origin: point(0, 0, -5), direction: vector(1, 1, 1) }
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
        { origin: point(0, 0, -5), direction: vector(0, 0, 1), t0: 5, t1: 5 },
        {
          origin: point(0, 0, -5),
          direction: vector(1, 1, 1),
          t0: 8.66025,
          t1: 8.66025
        },
        {
          origin: point(1, 1, -5),
          direction: vector(-0.5, -1, 1),
          t0: 4.55006,
          t1: 49.44994
        }
      ];
      testCases.forEach(t => {
        const ray = Ray(t.origin, normalize(t.direction));
        const xs = shape.localIntersect(ray);
        expect(xs.length).toBe(2);
        expect(floatIsEqual(xs[0].t, t.t0)).toBeTruthy();
        expect(floatIsEqual(xs[1].t, t.t1)).toBeTruthy();
      });
    });

    it("should detect intersections with ray parallel to one of its halves", () => {
      const ray = Ray(point(0, 0, -1), normalize(vector(0, 1, 1)));
      const xs = shape.localIntersect(ray);
      expect(xs.length).toBe(1);
      expect(floatIsEqual(xs[0].t, 0.35355)).toBeTruthy();
    });

    describe("on constrained cylinder", () => {
      beforeEach(() => {
        shape.minimum = -0.5;
        shape.maximum = 0.5;
      });

      it("should detect intersection with caps of closed cylinder", () => {
        shape.closed = true;

        const testCases = [
          { origin: point(0, 0, -5), direction: vector(0, 1, 0), count: 0 },
          { origin: point(0, 0, -0.25), direction: vector(0, 1, 1), count: 2 },
          { origin: point(0, 0, -0.25), direction: vector(0, 1, 0), count: 4 }
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
        { point: point(0, 0, 0), normal: vector(0, 0, 0) },
        { point: point(1, 1, 1), normal: vector(1, -Math.sqrt(2), 1) },
        { point: point(-1, -1, 0), normal: vector(-1, 1, 0) }
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
        { point: point(0, 1, 0), normal: vector(0, -1, 0) },
        { point: point(0.5, 1, 0), normal: vector(0, -1, 0) },
        { point: point(0, 1, 0.5), normal: vector(0, -1, 0) },
        { point: point(0, 2, 0), normal: vector(0, 1, 0) },
        { point: point(0.5, 2, 0), normal: vector(0, 1, 0) },
        { point: point(0, 2, 0.5), normal: vector(0, 1, 0) }
      ];
      testCases.forEach(t => {
        expect(shape.localNormalAt(t.point)).toEqualVector(t.normal);
      });
    });
  });

  describe("bounds", () => {
    it("should have infinite minimum and maximum bounds", () => {
      const bounds = shape.bounds();
      expect(bounds.min.y).toBe(Number.NEGATIVE_INFINITY);
      expect(bounds.max.y).toBe(Number.POSITIVE_INFINITY);
    });
  });
});
