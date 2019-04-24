import {
  Tuple,
  point,
  vector,
  add,
  sub,
  equals,
  negate,
  multiply,
  divide,
  magnitude,
  normalize,
  dot,
  cross,
  isPoint,
  isVector
} from "./tuple";

describe("Tuple", () => {
  it("sets values from constructor", () => {
    const t = Tuple(4.3, -4.2, 3.1, 1.0);
    expect(t.x).toEqual(4.3);
    expect(t.y).toEqual(-4.2);
    expect(t.z).toEqual(3.1);
    expect(t.w).toEqual(1.0);
  });

  it("with w = 1.0 is a point", () => {
    const t = Tuple(1, 1, 1, 1.0);
    expect(isPoint(t)).toBeTruthy();
    expect(isVector(t)).not.toBeTruthy();
  });

  it("with w = 0 is a vector", () => {
    const t = Tuple(1, 1, 1, 0.0);
    expect(isPoint(t)).not.toBeTruthy();
    expect(isVector(t)).toBeTruthy();
  });

  describe("adding", () => {
    it("point and vector creates point", () => {
      const p = Tuple.Point(3, -2, 5);
      const v = Tuple.Vector(-2, 3, 1);
      const result = add(p, v);
      expect(isPoint(result)).toBeTruthy();
      expect(equals(result, Tuple.Point(1, 1, 6))).toBeTruthy();
    });

    it("two vectors creates vector", () => {
      const v1 = Tuple.Vector(3, -2, 5);
      const v2 = Tuple.Vector(-2, 3, 1);
      const result = add(v1, v2);
      expect(isVector(result)).toBeTruthy();
      expect(equals(result, Tuple.Vector(1, 1, 6))).toBeTruthy();
    });
  });

  describe("subtracting", () => {
    it("two points creates vector", () => {
      const p1 = Tuple.Point(3, 2, 1);
      const p2 = Tuple.Point(5, 6, 7);
      const result = sub(p1, p2);
      expect(isVector(result)).toBeTruthy();
      expect(equals(result, Tuple.Vector(-2, -4, -6))).toBeTruthy();
    });

    it("vector from a point creates point", () => {
      const p = Tuple.Point(3, 2, 1);
      const v = Tuple.Vector(5, 6, 7);
      const result = sub(p, v);
      expect(isPoint(result)).toBeTruthy();
      expect(equals(result, Tuple.Point(-2, -4, -6))).toBeTruthy();
    });

    it("two vectors creates vector", () => {
      const v1 = Tuple.Vector(3, 2, 1);
      const v2 = Tuple.Vector(5, 6, 7);
      const result = sub(v1, v2);
      expect(isVector(result)).toBeTruthy();
      expect(equals(result, Tuple.Vector(-2, -4, -6))).toBeTruthy();
    });

    it("vector from a zero vector negages a tuple", () => {
      const zero = Tuple.Vector();
      const v1 = Tuple.Vector(1, -2, 3);
      const negated = sub(zero, v1);
      expect(equals(negated, Tuple.Vector(-1, 2, -3))).toBeTruthy();
    });
  });

  describe("negating", () => {
    it("vector creates a negated vector", () => {
      const v1 = Tuple.Vector(1, -2, 3, -4);
      const expected = Tuple.Vector(-1, 2, -3, 4);
      expect(equals(negate(v1), expected)).toBeTruthy();
    });
  });

  describe("multiplying", () => {
    it("by a scalar grows the tuple", () => {
      const t = Tuple(1, -2, 3, -4);
      const expected = Tuple(3.5, -7, 10.5, -14);
      expect(equals(multiply(t, 3.5), expected)).toBeTruthy();
    });

    it("by a fraction reduces the tuple", () => {
      const t = Tuple(1, -2, 3, -4);
      const expected = Tuple(0.5, -1, 1.5, -2);
      expect(equals(multiply(t, 0.5), expected)).toBeTruthy();
    });
  });

  describe("dividing", () => {
    it("by a scalar reduces the tuple", () => {
      const t = Tuple(1, -2, 3, -4);
      const expected = Tuple(0.5, -1, 1.5, -2);
      expect(equals(divide(t, 2), expected)).toBeTruthy();
    });
  });

  describe("magnitude", () => {
    it("computes the magnitude of a vector", () => {
      const t = Tuple.Vector(1, 0, 0);
      expect(magnitude(t)).toEqual(1);
      expect(magnitude(vector(0, 1, 0))).toEqual(1);
      expect(magnitude(vector(0, 0, 1))).toEqual(1);
      expect(magnitude(vector(1, 2, 3))).toEqual(Math.sqrt(14));
      expect(magnitude(vector(-1, -2, -3))).toEqual(Math.sqrt(14));
    });
  });

  describe("normalizing", () => {
    it("vector gives unit vector in the proper direction ", () => {
      let v = vector(4, 0, 0);
      let expected = vector(1, 0, 0);
      expect(equals(normalize(v), expected)).toBeTruthy();

      v = vector(1, 2, 3);
      expected = vector(
        1 / Math.sqrt(14),
        2 / Math.sqrt(14),
        3 / Math.sqrt(14)
      );
      expect(equals(normalize(v), expected)).toBeTruthy();
    });

    it("yields vector with magnitude = 1", () => {
      const v = vector(1, 2, 3);
      expect(magnitude(normalize(v))).toEqual(1);
    });
  });

  describe("dot product", () => {
    it("of two tuples yields a scalar", () => {
      const a = vector(1, 2, 3);
      const b = vector(2, 3, 4);
      expect(dot(a, b)).toEqual(20);
    });
  });

  describe("cross product", () => {
    it("of two vectors yields a vector", () => {
      const a = vector(1, 2, 3);
      const b = vector(2, 3, 4);
      expect(equals(cross(a, b), vector(-1, 2, -1))).toBeTruthy();
      expect(equals(cross(b, a), vector(1, -2, 1))).toBeTruthy();
    });
  });
});

describe("Tuple.Point", () => {
  it("has value 1.0 for w", () => {
    const t = Tuple.Point(4, -4, 3);
    expect(equals(t, Tuple(4, -4, 3, 1.0))).toBeTruthy();
  });
});

describe("Tuple.Vector", () => {
  it("has value 0 for w", () => {
    const t = Tuple.Vector(4, -4, 3);
    expect(equals(t, Tuple(4, -4, 3, 0)));
  });
});
