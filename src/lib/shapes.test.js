import { Shape } from "./shape";
import { Matrix, multiply } from "./matrix";
import { Material } from "./material";
import { rotationZ, translation, scaling } from "./transformations";
import { Ray } from "./ray";
import { point, vector } from "./tuple";

const testShape = () => {
  return new Shape();
};

describe("Shape", () => {
  describe("testShape", () => {
    it("should have transformation that is the identity matrix",  () => {
      expect(testShape().transformation).toEqualMatrix(Matrix.identity);
    });

    it("should let transformation be assignable", () => {
      const t = translation(2, 3, 4);
      const ts = testShape();
      ts.setTransform(t);
      expect(ts.transformation).toEqualMatrix(t);
    });

    it("should have a default material", () => {
      expect(testShape().material).toEqual(Material());
    });

    it("should let material be assignable", () => {
      const ts = testShape();
      let m = Material();
      m.ambient = 1;
      ts.material = m;
      expect(ts.material).toEqual(m);
    });
  });

  describe("intersect", () => {
    describe("scaled shape with a ray", () => {
    it("should call concrete implementation with ray converted to object space", () => {
      const ts = testShape();
      ts.setTransform(scaling(2, 2, 2));
      ts.localIntersect = jest.fn();
      const ray = Ray(point(0, 0, -5), vector(0, 0, 1));
      ts.intersect(ray);
      const expected = Ray(point(0, 0, -2.5), vector(0, 0, 0.5));
      expect(ts.localIntersect.mock.calls[0][0].toString()).toEqual(expected.toString());
    });
    });

    describe("translated shape with a ray", () => {
    it("should call concrete implementation with ray converted to object space", () => {
      const ts = testShape();
      ts.setTransform(translation(5, 0, 0));
      ts.localIntersect = jest.fn();
      const ray = Ray(point(0, 0, -5), vector(0, 0, 1));
      ts.intersect(ray);
      const expected = Ray(point(-5, 0, -5), vector(0, 0, 1));
      expect(ts.localIntersect.mock.calls[0][0].toString()).toEqual(expected.toString());
    });
    });
  });

  describe("normalAt", () => {
    it("on a translated shape", () => {
      const ts = testShape();
      ts.setTransform(translation(0, 1, 0));
      const n = ts.normalAt(point(0, 1.70711, -0.70711));
      expect(n).toEqualTuple(vector(0, 0.70711, -0.70711));
    });

    it("on a tranformed sphere", () => {
      const ts = testShape();
      const m = multiply(scaling(1, 0.5, 1), rotationZ(Math.PI / 5));
      ts.setTransform(m);
      const n = ts.normalAt(point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
      expect(n).toEqualTuple(vector(0, 0.97014, -0.24254));
    });
  });
});
