import { floatIsEqual as fequals } from "./math";

/**
 * Tuple object
 * Represents points and vectors
 */
export const Tuple = (x, y, z, w) => {
  let data = [x, y, z, w];

  return {
    x: data[0],
    y: data[1],
    z: data[2],
    w: data[3],
    toString: () => {
      return `(${data[0].toFixed(2)}, ${data[1].toFixed(2)}, ${data[2].toFixed(
        2
      )}, ${data[3]})`;
    }
  };
};

Tuple.Point = (x = 0.0, y = 0.0, z = 0.0) => {
  return Tuple(x, y, z, 1.0);
};

Tuple.Vector = (x = 0.0, y = 0.0, z = 0.0) => {
  return Tuple(x, y, z, 0.0);
};

export const point = Tuple.Point;
export const vector = Tuple.Vector;

/**
 * predicates
 */
export const isPoint = t => t.w === 1.0;
export const isVector = t => t.w === 0.0;

/**
 * operators
 */
export const add = (t1, t2) =>
  Tuple(t1.x + t2.x, t1.y + t2.y, t1.z + t2.z, t1.w + t2.w);

export const sub = (t1, t2) =>
  Tuple(t1.x - t2.x, t1.y - t2.y, t1.z - t2.z, t1.w - t2.w);

export const equals = (t1, t2) =>
  fequals(t1.x, t2.x) &&
  fequals(t1.y, t2.y) &&
  fequals(t1.z, t2.z) &&
  t1.w === t2.w;

export const negate = t => Tuple(-t.x, -t.y, -t.z, -t.w);

export const multiply = (t, s) => Tuple(t.x * s, t.y * s, t.z * s, t.w * s);

export const divide = (t, s) => multiply(t, 1 / s);

export const magnitude = t =>
  Math.sqrt(
    Math.pow(t.x, 2) + Math.pow(t.y, 2) + Math.pow(t.z, 2) + Math.pow(t.w, 2)
  );

export const normalize = t => {
  const mag = magnitude(t);
  return Tuple(t.x / mag, t.y / mag, t.z / mag, t.w / mag);
};

export const dot = (t1, t2) =>
  t1.x * t2.x + t1.y * t2.y + t1.z * t2.z + t1.w * t2.w;

export const cross = (t1, t2) =>
  vector(
    t1.y * t2.z - t1.z * t2.y,
    t1.z * t2.x - t1.x * t2.z,
    t1.x * t2.y - t1.y * t2.x
  );

/**
 * @param {Vector} v,
 * @param {Vector} normal
 * @returns {Vector}
 */
export const reflect = (v, normal) => {
  return sub(v, multiply(multiply(normal, 2), dot(v, normal)));
};
