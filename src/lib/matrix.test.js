import {point, vector} from "./tuple";
import {Matrix, equals} from "./matrix";

describe("Matrix", () => {
  describe("create", () => {
    it("should initialize a N X M matrix with default values", () => {
      let m = Matrix(3, 4);
      expect(m).toBeTruthy();
      expect(m.width()).toEqual(4);
      expect(m.height()).toEqual(3);
      expect(m.get(2, 2)).toEqual(0);
    });

    it("should initialize from nested arrays", () => {
      let m = Matrix.initFromArray([
        [1, 2, 3, 4],
        [5.5, 6.5, 7.5, 8.5],
        [9, 10, 11, 12],
        [13.5, 14.5, 15.5, 16.5]
      ]);
      expect(m.get(0, 0)).toEqual(1);
      expect(m.get(1, 0)).toEqual(5.5);
      expect(m.get(1, 2)).toEqual(7.5);
      expect(m.get(2, 2)).toEqual(11);
      expect(m.get(3, 0)).toEqual(13.5);
    });

    it("should should support 2x2 matrix", () => {
      let m = Matrix.initFromArray([
        [-3, 5],
        [1, -2]
      ]);
      expect(m.get(0, 0)).toEqual(-3);
      expect(m.get(0, 1)).toEqual(5);
      expect(m.get(1, 1)).toEqual(-2);
    });

    it("should should support 3x3 matrix", () => {
      let m = Matrix.initFromArray([
        [-3, 5, 0],
        [1, -2, -7],
        [0, 1, 1]
      ]);
      expect(m.get(0, 0)).toEqual(-3);
      expect(m.get(1, 1)).toEqual(-2);
      expect(m.get(2, 2)).toEqual(1);
    });
  });

  describe("operations", () => {
    it("should should support equality comparison", () => {
      let m = Matrix.initFromArray([
        [-3, 5, 0, 2],
        [1, -2, -7, 1],
        [0, 1, 1, 8]
      ]);
      let n = Matrix.initFromArray([
        [-3, 5, 0, 2],
        [1, -2, -7, 1],
        [0, 1, 1, 8]
      ]);
      let m2 = Matrix.initFromArray([
        [-3, 5, 0, 2],
        [1, -2, -7, 1],
        [0, 0, 1, 8]
      ]);

      expect(equals(m, n)).toBeTruthy();
      expect(equals(m, m2)).not.toBeTruthy();
    });
  });
});

