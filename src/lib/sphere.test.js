import { Shape } from "./shape";
import { Sphere } from "./sphere";
import { point, vector, normalize } from "./tuple";
import { Ray, intersect } from "./ray";
import { Matrix, multiply } from "./matrix";
import { scaling, translation, rotationZ } from "./transformations";
import { Material } from "./material";

describe("Sphere", () => {
  let s;

  beforeEach(() => {
    s = new Sphere();
  });

  it("should be a Shape", () => {
    expect(s).toBeInstanceOf(Shape);
  });

  it("intersect should set the object on the intersection", () => {
    const r = Ray(point(0, 0, -5), vector(0, 0, 1));
    const xs = s.intersect(r);
    expect(xs.length).toBe(2);
    expect(xs[0].object).toBe(s);
    expect(xs[1].object).toBe(s);
  });

  describe("normalAt", () => {
    it("should compute the normal of a sphere at a point on the x axis", () => {
      const n = s.localNormalAt(point(1, 0, 0));
      expect(n).toEqualTuple(vector(1, 0, 0));
    });

    it("should compute the normal of a sphere at a point on the y axis", () => {
      const n = s.localNormalAt(point(0, 1, 0));
      expect(n).toEqualTuple(vector(0, 1, 0));
    });

    it("should compute the normal of a sphere at a point on the z axis", () => {
      const n = s.localNormalAt(point(0, 0, 1));
      expect(n).toEqualTuple(vector(0, 0, 1));
    });

    it("should compute the normal of a sphere at a nonaxial point", () => {
      let val = Math.sqrt(3) / 3;

      const n = s.localNormalAt(point(val, val, val));
      expect(n).toEqualTuple(vector(val, val, val));
    });

    it("yields a normalized vector", () => {
      let val = Math.sqrt(3) / 3;
      const n = s.localNormalAt(point(val, val, val));
      expect(n).toEqualTuple(normalize(vector(val, val, val)));
    });
  });
});
