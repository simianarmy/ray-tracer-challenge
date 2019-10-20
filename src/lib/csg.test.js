import { Csg, makeCsg } from "./csg";
import { Sphere } from "./sphere";
import { Cube } from "./cube";
import { Intersection } from "./intersection";
import { Ray } from "./ray";
import { point, vector } from "./tuple";
import { translation } from "./transformations";

describe("Csg", () => {
  it("should create object from operation and 2 shapes", () => {
    const s1 = new Sphere();
    const s2 = new Cube();

    const csg = makeCsg(Csg.Union, s1, s2);
    expect(csg.operation).toEqual("union");
    expect(csg.left).toEqual(s1);
    expect(csg.right).toEqual(s2);
    expect(s1.parent).toEqual(csg);
    expect(s2.parent).toEqual(csg);
  });

  describe("intersection_allowed", () => {
      const truthTable = [
        [Csg.Union, true, true, true, false],
        [Csg.Union, true, true, false, true],
        [Csg.Union, true, false, true, false],
        [Csg.Union, true, false, false, true],
        [Csg.Union, false, true, true, false],
        [Csg.Union, false, true, false, false],
        [Csg.Union, false, false, true, true],
        [Csg.Union, false, false, false, true],
        [Csg.Intersection, true, true, true, true],
        [Csg.Intersection, true, true, false, false],
        [Csg.Intersection, true, false, true, true],
        [Csg.Intersection, true, false, false, false],
        [Csg.Intersection, false, true, true, true],
        [Csg.Intersection, false, true, false, true],
        [Csg.Intersection, false, false, true, false],
        [Csg.Intersection, false, false, false, false],
        [Csg.Difference, true, true, true, false],
        [Csg.Difference, true, true, false, true],
        [Csg.Difference, true, false, true, false],
        [Csg.Difference, true, false, false, true],
        [Csg.Difference, false, true, true, true],
        [Csg.Difference, false, true, false, true],
        [Csg.Difference, false, false, true, false],
        [Csg.Difference, false, false, false, false],
      ];

    it("should evaluate rules for all csg operations", () => {
      truthTable.forEach(op => {
        expect(Csg.intersectionAllowed(op[0], op[1], op[2], op[3])).toBe(op[4]);
      });
    });
  });

  it("should filter list intersections", () => {
    const s1 = new Sphere();
    const s2 = new Cube();
    const xs = [Intersection(1, s1), Intersection(2, s2), Intersection(3, s1), Intersection(4, s2)];

    const opTable = [
      [Csg.Union, 0, 3],
      [Csg.Intersection, 1, 2],
      [Csg.Difference, 0, 1]
    ];
    opTable.forEach(op => {
      const csg = makeCsg(op[0], s1, s2);
      const res = csg.filterIntersections(xs);
      expect(res.length).toBe(2);
      expect(res[0]).toEqual(xs[op[1]]);
      expect(res[1]).toEqual(xs[op[2]]);
    });
  });

  it("ray miss should detect no intersections", () => {
    const csg = makeCsg(Csg.Union, new Sphere(), new Cube());
    const r = Ray(point(0, 2, -5), vector(0, 0, 1));
    const xs = csg.localIntersect(r);
    expect(xs.length).toBe(0);
  });

  it("ray hit should find all intersections", () => {
    const s1 = new Sphere();
    const s2 = new Sphere();
    s2.setTransform(translation(0, 0, 0.5));
    const csg = makeCsg(Csg.Union, s1, s2);
    const r = Ray(point(0, 0, -5), vector(0, 0, 1));
    const xs = csg.localIntersect(r);
    console.log(xs);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(4);
    expect(xs[0].object).toEqual(s1);
    expect(xs[1].t).toBe(6.5);
    expect(xs[1].object).toEqual(s2);
  });
});
