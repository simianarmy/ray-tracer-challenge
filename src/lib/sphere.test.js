import { Sphere, normalAt } from "./sphere";
import { point, vector, normalize } from "./tuple";
import { Ray, intersect } from "./ray";
import { Matrix, multiply } from "./matrix";
import { scaling, translation, rotationZ } from "./transformations";

describe("Sphere", () => {
  let s;

  beforeEach(() => {
    s = Sphere();
  });

  it("intersect should set the object on the intersection", () => {
    const r = Ray(point(0, 0, -5), vector(0, 0, 1));
    const xs = intersect(s, r);
    expect(xs.length).toBe(2);
    expect(xs[0].object).toBe(s);
    expect(xs[1].object).toBe(s);
  });

  describe("transformations", () => {
    it("default should be the identity matrix", () => {
      expect(s.getTransform()).toEqualMatrix(Matrix.identity);
    });

    it("should be assignable", () => {
      const t = translation(2, 3, 4);
      s.setTransform(t);
      expect(s.getTransform()).toEqualMatrix(t);
    });
  });

  describe("intersecting", () => {
    it("scaled sphere with ray should find intersections", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      s.setTransform(scaling(2, 2, 2));
      const xs = intersect(s, r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(3);
      expect(xs[1].t).toBe(7);
    });

    it("translated sphere with ray should find intersections", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      s.setTransform(translation(5, 0, 0));
      const xs = intersect(s, r);
      expect(xs.length).toBe(0);
    });
  });

  describe("normalAt", () => {
    it("should compute the normal of a sphere at a point on the x axis", () => {
      const n = normalAt(s, point(1, 0, 0));
      expect(n).toEqualTuple(vector(1, 0, 0));
    });

    it("should compute the normal of a sphere at a point on the y axis", () => {
      const n = normalAt(s, point(0, 1, 0));
      expect(n).toEqualTuple(vector(0, 1, 0));
    });

    it("should compute the normal of a sphere at a point on the z axis", () => {
      const n = normalAt(s, point(0, 0, 1));
      expect(n).toEqualTuple(vector(0, 0, 1));
    });

    it("should compute the normal of a sphere at a nonaxial point", () => {
      let val = Math.sqrt(3) / 3;

      const n = normalAt(s, point(val, val, val));
      expect(n).toEqualTuple(vector(val, val, val));
    });

    it("yields a normalized vector", () => {
      let val = Math.sqrt(3) / 3;
      const n = normalAt(s, point(val, val, val));
      expect(n).toEqualTuple(normalize(vector(val, val, val)));
    });

    it("on a translated sphere", () => {
      s.setTransform(translation(0, 1, 0));
      const n = normalAt(s, point(0, 1.70711, -0.70711));
      expect(n).toEqualTuple(vector(0, 0.70711, -0.70711));
    });

    it("on a tranformed sphere", () => {
      const m = multiply(scaling(1, 0.5, 1), rotationZ(Math.PI / 5));
      s.setTransform(m);
      const n = normalAt(s, point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
      expect(n).toEqualTuple(vector(0, 0.97014, -0.24254));
    });
  });
});
