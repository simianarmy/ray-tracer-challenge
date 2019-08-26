import { parseObjFile, parseObjFromUrl } from "./obj-file";
import { point, vector } from "./tuple";
import { SmoothTriangle } from "./smooth-triangle";

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

  it("should normalize vertex records if requested", () => {
    const input = "v -1 1 0\n" +
    "v -1.0000 0.5000 0.0000\n" +
    "v 1 0 0\n" +
    "v 1 1 0";

    const parser = parseObjFile(input, {normalize: true});
    console.log("vertices", parser.vertices);
    expect(parser.vertices[1]).toEqualPoint(point(-1, 0.5, 0));
    //expect(parser.vertices[2]).toEqualPoint(point(-1, 0.5, 0));
    //expect(parser.vertices[3]).toEqualPoint(point(1, 0, 0));
    //expect(parser.vertices[4]).toEqualPoint(point(1, 1, 0));
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

  it("should parse face vertices with normals", () => {
    const input = "v 0 1 0\n" +
      "v -1 0 0\n" +
      "v 1 0 0\n" +
      "vn -1 0 0\n" +
      "vn 1 0 0\n" +
      "vn 0 1 0\n" +
      "f 1//3 2//1 3//2\n" +
      "f 1/0/3 2/102/1 3/14/2\n";

    const parser = parseObjFile(input);
    const g = parser.defaultGroup;
    const t1 = g.shapes[0];
    const t2 = g.shapes[1];
    expect(t1).toBeInstanceOf(SmoothTriangle);
    expect(t2).toBeInstanceOf(SmoothTriangle);
    expect(t1.p1).toEqualPoint(parser.vertices[1]);
    expect(t1.p2).toEqualPoint(parser.vertices[2]);
    expect(t1.p3).toEqualPoint(parser.vertices[3]);
    expect(t1.n1).toEqualVector(parser.normals[3]);
    expect(t1.n2).toEqualVector(parser.normals[1]);
    expect(t1.n3).toEqualVector(parser.normals[2]);
    expect(t2.p1).toEqualPoint(t1.p1);
    expect(t2.n1).toEqualVector(t1.n1);
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

  it("should parse vertex normals", () => {
    const input =
      "vn 0 0 1\n" +
      "vn 0.707 0 -0.707\n" +
      "vn 1 2 3\n";
    const parser = parseObjFile(input);
    expect(parser.normals[1]).toEqualVector(vector(0, 0, 1));
    expect(parser.normals[2]).toEqualVector(vector(0.707, 0, -.707));
    expect(parser.normals[3]).toEqualVector(vector(1, 2, 3));
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

  xit("should parse object file from url", async () => {
    const parser = await parseObjFromUrl("https://people.sc.fsu.edu/~jburkardt/data/obj/dodecahedron.obj")

    const group = parser.getGroupByName("Object001");
    const t = group.shapes[0];
    expect(t.p1).toEqualPoint(point(0.57735, -0.57735, .57735));
    expect(t.p2).toEqualPoint(point(0.934172, -0.356822, 0));
    expect(t.p3).toEqualPoint(point(0.934172, 0.356822, 0));
    expect(parser.vertices.length).toBeTruthy();
  });
});
