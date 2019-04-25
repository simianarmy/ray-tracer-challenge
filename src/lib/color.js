import { point, add as tadd, sub as tsub, multiply as tmult } from "./tuple";

export const Color = (r, g, b) => {
  let p = point(r, g, b);

  return { ...p, red: p.x, green: p.y, blue: p.z };
};

export const add = (c1, c2) => {
  const c = tadd(c1, c2);
  return Color(c.x, c.y, c.z);
};

export const subtract = (c1, c2) => {
  const c = tsub(c1, c2);
  return Color(c.x, c.y, c.z);
};

export const multiplyByScalar = (c1, s) => {
  const c = tmult(c1, s);
  return Color(c.x, c.y, c.z);
};

export const multiply = (c1, c2) => {
  const r = c1.red * c2.red;
  const g = c1.green * c2.green;
  const b = c1.blue * c2.blue;
  return Color(r, g, b);
};
