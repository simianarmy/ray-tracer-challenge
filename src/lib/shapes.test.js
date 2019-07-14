import { Shape } from "./shape";
import { Group } from "./group";
import { Sphere } from "./sphere";
import { Matrix, multiply } from "./matrix";
import { Material } from "./material";
import { rotationZ, translation, rotationY, scaling } from "./transformations";
import { Ray } from "./ray";
import { point, vector } from "./tuple";

const testShape = () => {
  return new Shape();
};

describe("Shape", () => {
  it("has a parent attribute", () => {
    expect(testShape().parent).toBe(null);
  });

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

    it("on a child object in a group", () => {
      const g1 = new Group();
      g1.setTransform(rotationY(Math.PI / 2));
      const g2 = new Group();
      g2.setTransform(scaling(1, 2, 3));
      g1.addChild(g2);
      const s = new Sphere();
      s.setTransform(translation(5, 0, 0));
      g2.addChild(s);
      const n = s.normalAt(point(1.7321, 1.1547, -5.5774));
      expect(n).toEqualVector(vector(0.28570, 0.428543, -0.85716));
    });
  });

  describe("converting a point from world space to object space", () => {
    it("should respect group hierarchy", () => {
      const g1 = new Group();
      g1.setTransform(rotationY(Math.PI / 2));
      const g2 = new Group();
      g2.setTransform(scaling(2, 2, 2));
      g1.addChild(g2);
      const s = new Sphere();
      s.setTransform(translation(5, 0, 0));
      g2.addChild(s);
      const p = s.worldToObject(point(-2, 0, -10));
      expect(p).toEqualPoint(point(0, 0, -1));
    });
  });

  describe("converting a normal from object space to world space", () => {
    it("should respect group hierarchy", () => {
      const g1 = new Group();
      g1.setTransform(rotationY(Math.PI / 2));
      const g2 = new Group();
      g2.setTransform(scaling(1, 2, 3));
      g1.addChild(g2);
      const s = new Sphere();
      s.setTransform(translation(5, 0, 0));
      g2.addChild(s);
      const n = s.normalToWorld(vector(Math.sqrt(3)/3, Math.sqrt(3)/3, Math.sqrt(3)/3));
      expect(n).toEqualVector(vector(0.28571, 0.42857, -0.85714));
    });
  });
});
