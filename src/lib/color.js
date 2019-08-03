import { point, add as tadd, sub as tsub, multiply as tmult } from "./tuple";

export const Color = (r, g, b) => {
  let p = point(r, g, b);

  return { ...p, red: p.x, green: p.y, blue: p.z };
};

Color.fromPoint = p => Color(p.x, p.y, p.z);

Color.Black = Color(0, 0, 0);
Color.Red = Color(1, 0, 0);
Color.Green = Color(0, 1, 0);
Color.Blue = Color(0, 0, 1);
Color.White = Color(1, 1, 1);

export const addColor = (c1, c2) => {
  const c = tadd(c1, c2);
  return Color(c.x, c.y, c.z);
};

export const subtractColor = (c1, c2) => {
  const c = tsub(c1, c2);
  return Color(c.x, c.y, c.z);
};

export const multiplyByScalar = (c1, s) => {
  const c = tmult(c1, s);
  return Color(c.x, c.y, c.z);
};

export const multiplyColor = (c1, c2) => {
  const r = c1.red * c2.red;
  const g = c1.green * c2.green;
  const b = c1.blue * c2.blue;
  return Color(r, g, b);
};
