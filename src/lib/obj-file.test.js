import { parseObjFile } from "./obj-file";
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
});
