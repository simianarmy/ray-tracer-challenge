import { floatIsEqual } from "./math";
import { Tuple, point, vector, equals as tupleEquals } from "./tuple";
import {
  Matrix,
  equals,
  multiply,
  multiplyTuple,
  transpose,
  determinant,
  submatrix,
  minor,
  cofactor,
  isInvertible,
  inverse
} from "./matrix";

expect.extend({
  toEqualMatrix(received, expected) {
    const passed = equals(received, expected);

    if (passed) {
      return {
        pass: true,
        message: () => `expected ${received} not to be equal to ${expected}`
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be equal to ${expected}`
      };
    }
  },

  toBeInvertible(received) {
    const passed = isInvertible(received);

    if (passed) {
      return {
        pass: true,
        message: () => `expected ${received} not to be invertible`
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be invertible`
      };
    }
  }
});

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
      let m = Matrix.initFromArray([[-3, 5], [1, -2]]);
      expect(m.get(0, 0)).toEqual(-3);
      expect(m.get(0, 1)).toEqual(5);
      expect(m.get(1, 1)).toEqual(-2);
    });

    it("should should support 3x3 matrix", () => {
      let m = Matrix.initFromArray([[-3, 5, 0], [1, -2, -7], [0, 1, 1]]);
      expect(m.get(0, 0)).toEqual(-3);
      expect(m.get(1, 1)).toEqual(-2);
      expect(m.get(2, 2)).toEqual(1);
    });

    it("should support set/get on elements", () => {
      let m = Matrix(3, 3);
      m.set(1, 1, 8);
      expect(m.get(1, 1)).toEqual(8);

      let m2 = Matrix.initFromArray([[-3, 5, 0], [1, -2, -7], [0, 1, 1]]);
      expect(m2.get(1, 1)).toEqual(-2);
      m2.set(1, 1, 8);
      expect(m2.get(1, 1)).toEqual(8);
    });

    it("should return row by index", () => {
      const m = Matrix.initFromArray([
        [-3, 5, 0, 2],
        [1, -2, -7, 1],
        [0, 1, 1, 8]
      ]);
      expect(m.row(1)).toEqual([1, -2, -7, 1]);
    });

    it("should return column by index", () => {
      const m = Matrix.initFromArray([
        [-3, 5, 0, 2],
        [1, -2, -7, 1],
        [0, 1, 1, 8]
      ]);
      expect(m.col(1)).toEqual([5, -2, 1]);
    });
  });

  describe("equality", () => {
    it("should support equality comparison", () => {
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

      expect(m).toEqualMatrix(n);
      expect(m).not.toEqualMatrix(m2);
    });
  });

  describe("multiplication", () => {
    it("should support NxN matrix mutliplication", () => {
      let m = Matrix.initFromArray([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 8, 7, 6],
        [5, 4, 3, 2]
      ]);
      let n = Matrix.initFromArray([
        [-2, 1, 2, 3],
        [3, 2, 1, -1],
        [4, 3, 6, 5],
        [1, 2, 7, 8]
      ]);
      const expected = Matrix.initFromArray([
        [20, 22, 50, 48],
        [44, 54, 114, 108],
        [40, 58, 110, 102],
        [16, 26, 46, 42]
      ]);
      expect(expected).toEqualMatrix(multiply(m, n));
    });

    it("should support multiplication with tuple", () => {
      let m = Matrix.initFromArray([
        [1, 2, 3, 4],
        [2, 4, 4, 2],
        [8, 6, 4, 1],
        [0, 0, 0, 1]
      ]);
      let t = Tuple(1, 2, 3, 1);
      const expected = Tuple(18, 24, 33, 1);
      const actual = multiplyTuple(m, t);
      expect(tupleEquals(expected, actual)).toBeTruthy();
    });

    it("with the identity matrix returns the original", () => {
      const m = Matrix.initFromArray([
        [1, 2, 3, 4],
        [2, 4, 4, 2],
        [8, 6, 4, 1],
        [0, 0, 0, 1]
      ]);
      const im = Matrix.identity;
      expect(m).toEqualMatrix(multiply(m, im));
    });
  });

  describe("transposing", () => {
    it("should turn rows into columns and columns into rows", () => {
      const m = Matrix.initFromArray([
        [1, 2, 3, 4],
        [2, 4, 4, 2],
        [8, 6, 4, 1],
        [0, 0, 0, 1]
      ]);
      const expected = Matrix.initFromArray([
        [1, 2, 8, 0],
        [2, 4, 6, 0],
        [3, 4, 4, 0],
        [4, 2, 1, 1]
      ]);
      expect(expected).toEqualMatrix(transpose(m));
    });

    it("the identity matrix returns the identity matrix", () => {
      expect(Matrix.identity).toEqualMatrix(transpose(Matrix.identity));
    });
  });

  describe("determinants", () => {
    it("should be calculated from 2x2 matrices", () => {
      const m = Matrix.initFromArray([[1, 5], [-3, 2]]);
      expect(determinant(m)).toBe(17);
    });

    it("should be calculated from 3x3 matrices", () => {
      const m = Matrix.initFromArray([[1, 2, 6], [-5, 8, -4], [2, 6, 4]]);
      expect(cofactor(m, 0, 0)).toBe(56);
      expect(cofactor(m, 0, 1)).toBe(12);
      expect(cofactor(m, 0, 2)).toBe(-46);
      expect(determinant(m)).toBe(-196);
    });

    it("should be calculated from 4x4 matrices", () => {
      const m = Matrix.initFromArray([
        [-2, -8, 3, 5],
        [-3, 1, 7, 3],
        [1, 2, -9, 6],
        [-6, 7, 7, -9]
      ]);
      expect(cofactor(m, 0, 0)).toBe(690);
      expect(cofactor(m, 0, 1)).toBe(447);
      expect(cofactor(m, 0, 2)).toBe(210);
      expect(cofactor(m, 0, 3)).toBe(51);
      expect(determinant(m)).toBe(-4071);
    });
  });

  describe("submatrix", () => {
    it("should return new matrix with the given row and column removed", () => {
      const m = Matrix.initFromArray([[1, 5, 0], [-3, 2, 7], [0, 6, -3]]);
      const expected = Matrix.initFromArray([[-3, 2], [0, 6]]);
      expect(submatrix(m, 0, 2)).toEqualMatrix(expected);

      const m2 = Matrix.initFromArray([
        [-6, 1, 1, 6],
        [-8, 5, 8, 6],
        [-1, 0, 8, 2],
        [-7, 1, -1, 1]
      ]);
      const expected2 = Matrix.initFromArray([
        [-6, 1, 6],
        [-8, 8, 6],
        [-7, -1, 1]
      ]);
      expect(submatrix(m2, 2, 1)).toEqualMatrix(expected2);
    });
  });

  describe("minor", () => {
    it("should calculate the minor of a matrix", () => {
      const m = Matrix.initFromArray([[3, 5, 0], [2, -1, -7], [6, -1, 5]]);
      const b = submatrix(m, 1, 0);
      expect(determinant(b)).toBe(25);
      expect(minor(m, 1, 0)).toBe(25);
    });
  });

  describe("cofactor", () => {
    it("should calculate the cofactor of a matrix", () => {
      const m = Matrix.initFromArray([[3, 5, 0], [2, -1, -7], [6, -1, 5]]);
      expect(minor(m, 0, 0)).toBe(-12);
      expect(cofactor(m, 0, 0)).toBe(-12);
      expect(minor(m, 1, 0)).toBe(25);
      expect(cofactor(m, 1, 0)).toBe(-25);
    });
  });

  describe("inversion", () => {
    it("should determine if an invertible matrix is invertible", () => {
      const m = Matrix.initFromArray([
        [6, 4, 4, 4],
        [5, 5, 7, 6],
        [4, -9, 3, -7],
        [9, 1, 7, -6]
      ]);
      expect(determinant(m)).toBe(-2120);
      expect(m).toBeInvertible();
    });

    it("should determine if an noninvertible matrix is invertible", () => {
      const m = Matrix.initFromArray([
        [-4, 2, -2, -3],
        [9, 6, 2, 6],
        [0, -5, 1, -5],
        [0, 0, 0, 0]
      ]);
      expect(determinant(m)).toBe(0);
      expect(m).not.toBeInvertible();
    });

    it("should calculate the inverse of a matrix", () => {
      let a = Matrix.initFromArray([
        [-5, 2, 6, -8],
        [1, -5, 1, 8],
        [7, 7, -6, -7],
        [1, -3, 7, 4]
      ]);
      let b = inverse(a);
      expect(determinant(a)).toBe(532);
      expect(cofactor(a, 2, 3)).toBe(-160);
      expect(floatIsEqual(b.get(3, 2), -160 / 532)).toBeTruthy();
      expect(cofactor(a, 3, 2)).toBe(105);
      expect(floatIsEqual(b.get(2, 3), 105 / 532)).toBeTruthy();

      let expected = Matrix.initFromArray([
        [0.21805, 0.45113, 0.2406, -0.04511],
        [-0.80827, -1.45677, -0.44361, 0.52068],
        [-0.07895, -0.22368, -0.05263, 0.19737],
        [-0.52256, -0.81391, -0.30075, 0.30639]
      ]);
      for (let i = 0; i < b.rows; i++) {
        for (let j = 0; j < b.columns; j++) {
          if (!floatIsEqual(b.get(i, j), expected.get(i, j))) {
            console.log(
              `values at ${i}, ${j} not equal! ${b.get(
                i,
                j
              )} !== ${expected.get(i, j)}`
            );
          }
        }
      }
      expect(expected).toEqualMatrix(b);

      a = Matrix.initFromArray([
        [8, -5, 9, 2],
        [7, 5, 6, 1],
        [-6, 0, 9, 6],
        [-3, 0, -9, -4]
      ]);
      expected = Matrix.initFromArray([
        [-0.15385, -0.15385, -0.28205, -0.53846],
        [-0.07692, 0.12308, 0.02564, 0.03077],
        [0.35897, 0.35897, 0.4359, 0.92308],
        [-0.69231, -0.69231, -0.76923, -1.92308]
      ]);
      expect(expected).toEqualMatrix(inverse(a));

      a = Matrix.initFromArray([
        [9, 3, 0, 9],
        [-5, -2, -6, -3],
        [-4, 9, 6, 4],
        [-7, 6, 6, 2]
      ]);
      expected = Matrix.initFromArray([
        [-0.04074, -0.07778, 0.14444, -0.22222],
        [-0.07778, 0.03333, 0.36667, -0.33333],
        [-0.02901, -0.1463, -0.10926, 0.12963],
        [0.17778, 0.06667, -0.26667, 0.33333]
      ]);
      expect(expected).toEqualMatrix(inverse(a));
    });

    it("multiplying a product by its inverse should yield the original", () => {
      const a = Matrix.initFromArray([
        [3, -9, 7, 3],
        [3, -8, 2, -9],
        [-4, 4, 4, 1],
        [-6, 5, -1, 1]
      ]);
      const b = Matrix.initFromArray([
        [8, 2, 2, 2],
        [3, -1, 7, 0],
        [7, 0, 5, 4],
        [6, -2, 0, 5]
      ]);
      const c = multiply(a, b);
      const expected = multiply(c, inverse(b));
      expect(expected).toEqualMatrix(a);
    });
  });
});
