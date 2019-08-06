import { parseObjFile, parseObjFromUrl } from "./obj-file";
import { point } from "./tuple";

describe("obj-file", () => {
  it("should ignore unrecognized lines", () => {
    const gibberish = "blab lbah blajhb\nblabalbadfadf\nblab";
    const parser = parseObjFile(gibberish);
    expect(parser.ignoredLines.length).toEqual(3);
  });

  it("should parse vertex records", () => {
    const input = "v -1 1 0\n" +
    "v -1.0000 0.5000 0.0000\n" +
    "v 1 0 0\n" +
    "v 1 1 0";

    const parser = parseObjFile(input);
    expect(parser.vertices[1]).toEqualPoint(point(-1, 1, 0));
    expect(parser.vertices[2]).toEqualPoint(point(-1, 0.5, 0));
    expect(parser.vertices[3]).toEqualPoint(point(1, 0, 0));
    expect(parser.vertices[4]).toEqualPoint(point(1, 1, 0));
  });

  it("should parse triangle faces", () => {
    const input = "v -1 1 0\n" +
      "v -1.0000 0 0.0000\n" +
      "v 1 0 0\n" +
      "v 1 1 0\n\n" +
      "f 1 2 3\n" +
      "f 1 3 4\n";

    const parser = parseObjFile(input);
    const g = parser.defaultGroup;
    const t1 = g.shapes[0];
    const t2 = g.shapes[1];
    expect(t1.p1).toEqualPoint(parser.vertices[1]);
    expect(t1.p2).toEqualPoint(parser.vertices[2]);
    expect(t1.p3).toEqualPoint(parser.vertices[3]);
    expect(t2.p1).toEqualPoint(parser.vertices[1]);
    expect(t2.p2).toEqualPoint(parser.vertices[3]);
    expect(t2.p3).toEqualPoint(parser.vertices[4]);
  });

  it("should parse face vertices in OBJ format", () => {
    const input = "v -1 1 0\n" +
      "v -1.0000 0 0.0000\n" +
      "v 1 0 0\n" +
      "v 1 1 0\n\n" +
      "f 1/1/1 2/2/2 3/3/3\n" +
      "f 1/2/3 3/2/2 4/3/2\n";

    const parser = parseObjFile(input);
    const g = parser.defaultGroup;
    const t1 = g.shapes[0];
    const t2 = g.shapes[1];
    expect(t1.p1).toEqualPoint(parser.vertices[1]);
    expect(t1.p2).toEqualPoint(parser.vertices[2]);
    expect(t1.p3).toEqualPoint(parser.vertices[3]);
    expect(t2.p1).toEqualPoint(parser.vertices[1]);
    expect(t2.p2).toEqualPoint(parser.vertices[3]);
    expect(t2.p3).toEqualPoint(parser.vertices[4]);
  });

  it("should parse and triangulate polygons", () => {
    const input = "v -1 1 0\n" +
      "v -1.0000 0 0.0000\n" +
      "v 1 0 0\n" +
      "v 1 1 0\n\n" +
      "v 0 2 0\n" +
      "f 1 2 3 4 5\n";

    const parser = parseObjFile(input);
    const [t1, t2, t3] = parser.defaultGroup.shapes;

    expect(t1.p1).toEqualPoint(parser.vertices[1]);
    expect(t1.p2).toEqualPoint(parser.vertices[2]);
    expect(t1.p3).toEqualPoint(parser.vertices[3]);
    expect(t2.p1).toEqualPoint(parser.vertices[1]);
    expect(t2.p2).toEqualPoint(parser.vertices[3]);
    expect(t2.p3).toEqualPoint(parser.vertices[4]);
    expect(t3.p1).toEqualPoint(parser.vertices[1]);
    expect(t3.p2).toEqualPoint(parser.vertices[4]);
    expect(t3.p3).toEqualPoint(parser.vertices[5]);
  });

  it("should parse triangles with named groups", () => {
    const input =
      "v -1 1 0\n" +
      "v -1 0 0\n" +
      "v 1 0 0\n" +
      "v 1 1 0\n\n" +
      "g FirstGroup\n" +
      "f 1 2 3\n" +
      "g SecondGroup\n" +
      "f 1 3 4\n";

    const parser = parseObjFile(input);
    const g1 = parser.getGroupByName("FirstGroup");
    const g2 = parser.getGroupByName("SecondGroup");
    const t1 = g1.shapes[0];
    const t2 = g2.shapes[0];
    expect(t1.p1).toEqualPoint(parser.vertices[1]);
    expect(t1.p2).toEqualPoint(parser.vertices[2]);
    expect(t1.p3).toEqualPoint(parser.vertices[3]);
    expect(t2.p1).toEqualPoint(parser.vertices[1]);
    expect(t2.p2).toEqualPoint(parser.vertices[3]);
    expect(t2.p3).toEqualPoint(parser.vertices[4]);
  });

  it("should be able to convert an object file to a Group instance", () => {
    const input =
      "v -1 1 0\n" +
      "v -1 0 0\n" +
      "v 1 0 0\n" +
      "v 1 1 0\n\n" +
      "g FirstGroup\n" +
      "f 1 2 3\n" +
      "g SecondGroup\n" +
      "f 1 3 4\n";

    const parser = parseObjFile(input);
    const group = parser.toGroup();
    expect(group.shapes).toContain(parser.getGroupByName("FirstGroup"));
    expect(group.shapes).toContain(parser.getGroupByName("SecondGroup"));
  });

  it("should parse object file from url", async () => {
    //const parser = await parseObjFromUrl("https://groups.csail.mit.edu/graphics/classes/6.837/F03/models/teapot.obj");
    //console.log(parser);
    //expect(parser.vertices.length).toBeTruthy();
    //const parser = await parseObjFromUrl("https://graphics.cs.utah.edu/courses/cs6620/fall2013/prj05/teapot-low.obj");
    const parser = await parseObjFromUrl("https://people.sc.fsu.edu/~jburkardt/data/obj/dodecahedron.obj")

    const group = parser.getGroupByName("Object001");
    const t = group.shapes[0];
    expect(t.p1).toEqualPoint(point(0.57735, -0.57735, .57735));
    expect(t.p2).toEqualPoint(point(0.934172, -0.356822, 0));
    expect(t.p3).toEqualPoint(point(0.934172, 0.356822, 0));
    expect(parser.vertices.length).toBeTruthy();
  });
});
