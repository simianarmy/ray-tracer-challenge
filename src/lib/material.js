import { Color } from "./color";

const DEFAULT_COLOR = Color(1, 1, 1);
const DEFAULT_AMBIENT = 0.1;
const DEFAULT_DIFFUSE = 0.9;
const DEFAULT_SPECULAR = 0.9;
const DEFAULT_SHININESS = 200;

export const Material = () => {
  return {
    color: DEFAULT_COLOR,
    ambient: DEFAULT_AMBIENT,
    diffuse: DEFAULT_DIFFUSE,
    specular: DEFAULT_SPECULAR,
    shininess: DEFAULT_SHININESS
  };
};
