// Floating point equality
export const EPSILON = 0.00001;
export const floatIsEqual = (f1, f2) => Math.abs(f1 - f2) < EPSILON; // Number.EPSILON;
export const degreesToRadians = d => d / 180 * Math.PI;
