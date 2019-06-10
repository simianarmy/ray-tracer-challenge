import { Cube } from "./cube";
import { point, vector } from "./tuple";
import { Ray } from "./ray";

describe("Cube", () => {
  let cube;

  beforeEach(() => {
    cube = new Cube();
  });

  describe("ray intersection", () => {
    function testIntersectFace({from, to, t1, t2}) {
      const r = Ray(from, to);
      const xs = cube.localIntersect(r);
      expect(xs.length).toBe(2);
      expect(xs[0].t).toBe(t1);
      expect(xs[1].t).toBe(t2);
    }

    it("should detect intersection with any face", () => {
      const testCases = [
        {from: point(5, 0.5, 0), to: vector(-1, 0, 0), t1: 4, t2: 6},
        {from: point(-5, 0.5, 0), to: vector(1, 0, 0), t1: 4, t2: 6},
        {from: point(0.5, 5, 0), to: vector(0, -1, 0), t1: 4, t2: 6},
        {from: point(0.5, -5, 0), to: vector(0, 1, 0), t1: 4, t2: 6},
        {from: point(0.5, 0, 5), to: vector(0, 0, -1), t1: 4, t2: 6},
        {from: point(0.5, 0, -5), to: vector(0, 0, 1), t1: 4, t2: 6},
        {from: point(0, 0.5, 0), to: vector(0, 0, 1), t1: -1, t2: 1},
      ];
      testCases.forEach(t => testIntersectFace(t));
    });

    it("should detect non-intersection", () => {
      const testCases = [
        {from: point(-2, 0, 0), to: vector(0.2673, 0.5345, 0.8018)},
        {from: point(0, -2, 0), to: vector(0.8018, 0.2673, 0.5345)},
        {from: point(0, 0, -2), to: vector(0.5345, 0.8018, 0.2673)},
        {from: point(2, 0, 2), to: vector(0, 0, -1)},
        {from: point(0, 2, 2), to: vector(0, -1, 0)},
        {from: point(2, 2, 0), to: vector(-1, 0, 0)},
      ];
      testCases.forEach(t => {
        const r = Ray(t.from, t.to);
        const xs = cube.localIntersect(r);
        expect(xs.length).toBe(0);
      });
    });
  });

  describe("normal", () => {
    it("should be computed for each surface", () => {
      const testCases = [
        {p: point(1, 0.5, -0.8), normal: vector(1, 0, 0)},
        {p: point(-1, -0.2, 0.9), normal: vector(-1, 0, 0)},
        {p: point(-0.4, 1, -0.1), normal: vector(0, 1, 0)},
        {p: point(-0.4, 0.4, 1), normal: vector(0, 0, 1)},
        {p: point(1, 1, 1), normal: vector(1, 0, 0)},
        {p: point(-1, -1, -1), normal: vector(-1, 0, 0)}
      ];
      testCases.forEach(t => {
        expect(cube.localNormalAt(t.p)).toEqualVector(t.normal);
      });
    });
  });
});
