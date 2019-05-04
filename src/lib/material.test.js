import { Material } from "./material";
import { Color } from "./color";

describe("Material", () => {
  it("should have default values", () => {
    const m = Material();
    expect(m.color).toEqualColor(Color(1, 1, 1));
    expect(m.ambient).toBe(0.1);
    expect(m.diffuse).toBe(0.9);
    expect(m.specular).toBe(0.9);
    expect(m.shininess).toBe(200);
  });
});

