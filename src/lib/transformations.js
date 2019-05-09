import { Matrix, multiply } from "./matrix";
import { cross, normalize, sub, negate } from "./tuple";

export const translation = (x, y, z) => {
  return Matrix.initFromArray([
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1]
  ]);
};

export const scaling = (x, y, z) => {
  return Matrix.initFromArray([
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1]
  ]);
};

export const rotationX = r => {
  return Matrix.initFromArray([
    [1, 0, 0, 0],
    [0, Math.cos(r), -Math.sin(r), 0],
    [0, Math.sin(r), Math.cos(r), 0],
    [0, 0, 0, 1]
  ]);
};

export const rotationY = r => {
  return Matrix.initFromArray([
    [Math.cos(r), 0, Math.sin(r), 0],
    [0, 1, 0, 0],
    [-Math.sin(r), 0, Math.cos(r), 0],
    [0, 0, 0, 1]
  ]);
};

export const rotationZ = r => {
  return Matrix.initFromArray([
    [Math.cos(r), -Math.sin(r), 0, 0],
    [Math.sin(r), Math.cos(r), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);
};

export const shearing = (xy, xz, yx, yz, zx, zy) => {
  return Matrix.initFromArray([
    [1, xy, xz, 0],
    [yx, 1, yz, 0],
    [zx, zy, 1, 0],
    [0, 0, 0, 1]
  ]);
};

export const viewTransform = (from, to, up) => {
  const forward = normalize(sub(to, from));
  const upn = normalize(up);
  const left = cross(forward, upn);
  const trueUp = cross(left, forward);
  const orientation = Matrix.initFromArray([
    [left.x, left.y, left.z, 0],
    [trueUp.x, trueUp.y, trueUp.z, 0],
    [-forward.x, -forward.y, -forward.z, 0],
    [0, 0, 0, 1]
  ]);
  return multiply(orientation, translation(-from.x, -from.y, -from.z));
};
