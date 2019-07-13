import { Group } from "./group";
import { Shape } from "./shape";
import { Matrix } from "./matrix";

describe("Group", () => {
  let g;

  beforeEach(() => {
    g = new Group();
  });

  it("has its own transformation", () => {
    expect(g.transformation).toEqualMatrix(Matrix.identity);
  });

  it("start with no shapes in its collection", () => {
    expect(g.shapes.length).toBe(0);
  });

  describe("adding child to a group", () => {
    it("should set the group as the parent of the child", () => {
      let shape = new Shape();
      g.addChild(shape);
      expect(g.shapes.length).toBe(1);
      expect(g.shapes[0]).toEqual(shape);
      expect(shape.parent).toEqual(g);
    });
  });
});
