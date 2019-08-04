import { point } from "./tuple";
import { Group } from "./group";
import { Triangle } from "./triangle";

/**
 * @param {String} input
 * @returns {Parser}
 */
export function parseObjFile(input) {
  const parser = new Parser();

  parser.parseString(input);

  return parser;
}

class Parser {
  constructor() {
    this.ignoredLines = [];
    this.vertices = [null];
    this.lastInstruction = null;
    this.lastVertexGroupIndex = 0;
    this.defaultGroup = new Group();
  }

  parseString(str) {
    str.split("\n").forEach(line => {
      this.parseLine(line);
    });
  }

  getVertexByIndex(idx) {
    //console.log("getting vertex by index for ", idx);
    const startIndex = this.lastVertexGroupIndex;
    //console.log("startIndex", startIndex);
    return this.vertices[startIndex + idx];
  }

  parseVertex(parts) {
    return point(Number(parts[1].trim()), Number(parts[2].trim()), Number(parts[3].trim()));
  }

  parseFace(parts) {
    const vs = this.parseVertex(parts);
    //console.log("vs", vs);
    const p1 = this.getVertexByIndex(vs.x);
    const p2 = this.getVertexByIndex(vs.y);
    const p3 = this.getVertexByIndex(vs.z);
    //console.log("parseFace group", group);
    return new Triangle(p1, p2, p3);
  }

  triangulatePolygon(parts) {
    //console.log("triangulate parts", parts);
    const v1 = this.getVertexByIndex(Number(parts[1]));
    const triangles = [];

    for (let index = 2; index < parts.length - 1; index++) {
      const v2 = this.getVertexByIndex(Number(parts[index]));
      const v3 = this.getVertexByIndex(Number(parts[index+1]));

      //console.log("triangulate points", v1, v2, v3);
      triangles.push(new Triangle(v1, v2, v3));
    }

    return triangles;
  }

  parseLine(line) {
    //console.log("parsing line", line);
    const parts = line.split(' ').filter(c => c !== "\n").map(p => p.trim());

    //console.log("parts", parts);
    if (parts[0] === "v") {
      if (this.lastInstruction !== "v") {
        this.lastVertexGroupIndex = this.vertices.length - 1;
      }
      const p = this.parseVertex(parts);
      //console.log("parsed point", p);
      this.vertices.push(p);
      this.lastInstruction = "v";
    } else if (parts[0] === "f") {
      // if polygon
      if (parts.length > 4) {
        // TODO: generalize for all face instructions
        this.triangulatePolygon(parts).forEach(triangle => {
          this.defaultGroup.addChild(triangle);
        });
      } else {
        this.defaultGroup.addChild(this.parseFace(parts));
      }

      this.lastInstruction = "f";
    } else {
      this.ignoredLines.push(line);
    }
  }
}
