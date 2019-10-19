import { Csg, makeCsg } from "./csg";
import { Sphere } from "./sphere";
import { Cube } from "./cube";

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
});
