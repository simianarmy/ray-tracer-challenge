import { Group } from "./group";
import { Shape } from "./shape";
import { Sphere } from "./sphere";
import { Cube } from "./cube";
import { Cone } from "./cone";
import { Matrix } from "./matrix";
import { Ray } from "./ray";
import { point, vector } from "./tuple";
import { scaling, translation, rotationY } from "./transformations";

describe("Group", () => {
  let g;

  beforeEach(() => {
    g = new Group();
  });

  it("has its own transformation", () => {
    expect(g.transformation).toEqualMatrix(Matrix.identity);
  });

  it("start with no shapes in its collection", () => {
    expect(g.shapes.length).toBe(0);
  });

  describe("adding child to a group", () => {
    it("should set the group as the parent of the child", () => {
      let shape = new Shape();
      g.addChild(shape);
      expect(g.shapes.length).toBe(1);
      expect(g.shapes[0]).toEqual(shape);
      expect(shape.parent).toEqual(g);
    });
  });

  describe("intersecting a ray", () => {
    it("should not intersect if group is empty", () => {
      let ray = Ray(point(0, 0, 0), vector(0, 0, 1));
      let xs = g.localIntersect(ray);
      expect(xs.length).toBe(0);
    });

    it("should detect intersections with shapes", () => {
      const s1 = new Sphere();
      const s2 = new Sphere();
      s2.setTransform(translation(0, 0, -3));
      const s3 = new Sphere();
      s3.setTransform(translation(5, 0, 0));
      g.addChild(s1);
      g.addChild(s2);
      g.addChild(s3);
      const ray = Ray(point(0, 0, -5), vector(0, 0, 1));
      const xs = g.localIntersect(ray);
      expect(xs[0].object).toEqual(s2);
      expect(xs[1].object).toEqual(s2);
      expect(xs[2].object).toEqual(s1);
      expect(xs[3].object).toEqual(s1);
    });

    it("should intersect a transformed group", () => {
      g.setTransform(scaling(2, 2, 2));
      const s = new Sphere();
      s.setTransform(translation(5, 0, 0));
      g.addChild(s);
      const ray = Ray(point(10, 0, -10), vector(0, 0, 1));
      const xs = g.intersect(ray);
      expect(xs.length).toBe(2);
    });
  });

  describe("bounding box", () => {
    it("should calculate bounding box of empty group", () => {
      expect(g.bounds().min).toEqualPoint(point(-1, -1, -1));
      expect(g.bounds().max).toEqualPoint(point(1, 1, 1));
    });

    it("should calculate containing box of untransformed shapes", () => {
      const s = new Sphere();
      g.addChild(s);
      const c = new Cube();
      g.addChild(c);
      const bounds = g.bounds();
      expect(g.bounds().min).toEqualPoint(point(-1, -1, -1));
      expect(g.bounds().max).toEqualPoint(point(1, 1, 1));
    });

    it("should calculate containing box of transformed shapes", () => {
      const s = new Sphere();
      s.setTransform(translation(5, -2, 0));
      g.addChild(s);
      const c = new Cube();
      c.setTransform(rotationY(Math.PI/2));
      const c2 = new Cube();
      c2.setTransform(scaling(3, 2, 5));
      g.addChild(c2);
      const bounds = g.bounds();
      expect(bounds.min).toEqualPoint(point(-3, -3, -5));
      expect(bounds.max).toEqualPoint(point(6, 2, 5));
    });

    it("should calculate containing box of shapes with infinite bounds", () => {
      const c = new Cone();
      c.minimum = -2;
      g.addChild(c);
      const bounds = g.bounds();
      expect(bounds.min.x).toBe(Number.NEGATIVE_INFINITY);
      expect(bounds.min.y).toBe(-2);
      expect(bounds.max.y).toBe(Number.POSITIVE_INFINITY);
    });
  });
});
