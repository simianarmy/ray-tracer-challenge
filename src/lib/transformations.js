import { Matrix } from "./matrix";

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
