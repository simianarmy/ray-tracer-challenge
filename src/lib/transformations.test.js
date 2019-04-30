import {
  translation,
  scaling,
  rotationX,
  rotationY,
  rotationZ,
  shearing
} from "./transformations";
import { multiply, multiplyTuple, inverse } from "./matrix";
import { point, vector, equals } from "./tuple";

describe("translation", () => {
  it("multiplying by a translation matrix should move a point", () => {
    const transform = translation(5, -3, 2);
    const p = point(-3, 4, 5);
    const expected = point(2, 1, 7);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("multiplying by the inverse of a translation matrix should move a point in the opposite direction", () => {
    const transform = translation(5, -3, 2);
    const inv = inverse(transform);
    const p = point(-3, 4, 5);
    const expected = point(-8, 7, 3);
    expect(equals(expected, multiplyTuple(inv, p))).toBeTruthy();
  });

  it("does not affect vectors", () => {
    const transform = translation(5, -3, 2);
    const v = vector(-3, 4, 5);
    expect(equals(multiplyTuple(transform, v), v)).toBeTruthy();
  });
});

describe("scaling", () => {
  it("matrix applied to a point yields a scaled point", () => {
    const transform = scaling(2, 3, 4);
    const p = point(-4, 6, 8);
    const expected = point(-8, 18, 32);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("matrix applied to a vector yields a scaled vector", () => {
    const transform = scaling(2, 3, 4);
    const v = vector(-4, 6, 8);
    const expected = vector(-8, 18, 32);
    expect(equals(expected, multiplyTuple(transform, v))).toBeTruthy();
  });

  it("multiplying by the inverse of a scaling vector", () => {
    const transform = scaling(2, 3, 4);
    const inv = inverse(transform);
    const v = vector(-4, 6, 8);
    const expected = vector(-2, 2, 2);
    expect(equals(expected, multiplyTuple(inv, v))).toBeTruthy();
  });

  it("reflection is scaling by a negative value", () => {
    const transform = scaling(-1, 1, 1);
    const p = point(2, 3, 4);
    const expected = point(-2, 3, 4);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });
});

describe("rotating", () => {
  it("with rotationX should rotate a point around the x axis", () => {
    const p = point(0, 1, 0);
    const half_quarter = rotationX(Math.PI / 4);
    const full_quarter = rotationX(Math.PI / 2);
    const expected1 = point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    expect(equals(expected1, multiplyTuple(half_quarter, p))).toBeTruthy();
    const expected2 = point(0, 0, 1);
    expect(equals(expected2, multiplyTuple(full_quarter, p))).toBeTruthy();
  });

  it("inverse of an x-rotation rotates in the opposite direction", () => {
    const p = point(0, 1, 0);
    const half_quarter = rotationX(Math.PI / 4);
    const inv = inverse(half_quarter);
    const expected = point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
    expect(equals(expected, multiplyTuple(inv, p))).toBeTruthy();
  });

  it("with rotationY should rotate a point around the y axis", () => {
    const p = point(0, 0, 1);
    const half_quarter = rotationY(Math.PI / 4);
    const full_quarter = rotationY(Math.PI / 2);
    const expected1 = point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2);
    expect(equals(expected1, multiplyTuple(half_quarter, p))).toBeTruthy();
    const expected2 = point(1, 0, 0);
    expect(equals(expected2, multiplyTuple(full_quarter, p))).toBeTruthy();
  });

  it("with rotationZ should rotate a point around the z axis", () => {
    const p = point(0, 1, 0);
    const half_quarter = rotationZ(Math.PI / 4);
    const full_quarter = rotationZ(Math.PI / 2);
    const expected1 = point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
    expect(equals(expected1, multiplyTuple(half_quarter, p))).toBeTruthy();
    const expected2 = point(-1, 0, 0);
    expect(equals(expected2, multiplyTuple(full_quarter, p))).toBeTruthy();
  });
});

describe("shearing", () => {
  it("moves x in proportion to y", () => {
    const transform = shearing(1, 0, 0, 0, 0, 0);
    const p = point(2, 3, 4);
    const expected = point(5, 3, 4);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("moves x in proportion to z", () => {
    const transform = shearing(0, 1, 0, 0, 0, 0);
    const p = point(2, 3, 4);
    const expected = point(6, 3, 4);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("moves y in proportion to x", () => {
    const transform = shearing(0, 0, 1, 0, 0, 0);
    const p = point(2, 3, 4);
    const expected = point(2, 5, 4);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("moves y in proportion to z", () => {
    const transform = shearing(0, 0, 0, 1, 0, 0);
    const p = point(2, 3, 4);
    const expected = point(2, 7, 4);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("moves z in proportion to x", () => {
    const transform = shearing(0, 0, 0, 0, 1, 0);
    const p = point(2, 3, 4);
    const expected = point(2, 3, 6);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });

  it("moves z in proportion to y", () => {
    const transform = shearing(0, 0, 0, 0, 0, 1);
    const p = point(2, 3, 4);
    const expected = point(2, 3, 7);
    expect(equals(expected, multiplyTuple(transform, p))).toBeTruthy();
  });
});

describe("chaining", () => {
  it("individual transformations applied in sequence should work", () => {
    const p = point(1, 0, 1);
    const A = rotationX(Math.PI / 2);
    const B = scaling(5, 5, 5);
    const C = translation(10, 5, 7);

    const p2 = multiplyTuple(A, p);
    expect(equals(p2, point(1, -1, 0))).toBeTruthy();

    const p3 = multiplyTuple(B, p2);
    expect(equals(p3, point(5, -5, 0))).toBeTruthy();

    const p4 = multiplyTuple(C, p3);
    expect(equals(p4, point(15, 0, 7))).toBeTruthy();
  });

  it("transformations must be applied in reverse order", () => {
    const p = point(1, 0, 1);
    const A = rotationX(Math.PI / 2);
    const B = scaling(5, 5, 5);
    const C = translation(10, 5, 7);
    const T = multiply(multiply(C, B), A);
    const expected = point(15, 0, 7);
    expect(equals(expected, multiplyTuple(T, p)));
  });
});
