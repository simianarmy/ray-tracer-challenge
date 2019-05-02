import { Sphere } from "./sphere";
import { point, vector } from "./tuple";
import { Ray, intersect } from "./ray";
import { Matrix } from "./matrix";
import { scaling, translation } from "./transformations";

describe("Sphere", () => {
  it("intersect should set the object on the intersection", () => {
    const r = Ray(point(0, 0, -5), vector(0, 0, 1));
    const s = Sphere();
    const xs = intersect(s, r);
    expect(xs.length).toBe(2);
    expect(xs[0].object).toBe(s);
    expect(xs[1].object).toBe(s);
  });

  describe("transformations", () => {
    it("default should be the identity matrix", () => {
      const s = Sphere();
      expect(s.getTransform()).toEqualMatrix(Matrix.identity);
    });

    it("should be assignable", () => {
      const s = Sphere();
      const t = translation(2, 3, 4);
      s.setTransform(t);
      expect(s.getTransform()).toEqualMatrix(t);
    });
  });

  describe("intersecting", () => {
    it("scaled sphere with ray should find intersections", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const s = Sphere();
      s.setTransform(scaling(2, 2, 2));
      const xs = intersect(s, r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(3);
      expect(xs[1].t).toBe(7);
    });

    it("translated sphere with ray should find intersections", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const s = Sphere();
      s.setTransform(translation(5, 0, 0));
      const xs = intersect(s, r);
      expect(xs.length).toBe(0);
    });
  });
});
