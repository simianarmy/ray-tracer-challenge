import axios from "axios";

import { point, vector } from "./tuple";
import { Group } from "./group";
import { Triangle } from "./triangle";
import { SmoothTriangle } from "./smooth-triangle";

export async function parseObjFromUrl(url) {
  const res = await axios.get(url);

  if (res.data) {
    return parseObjFile(res.data);
  } else {
    return "";
  }
}

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
    this.normals = [null];
    this.lastInstruction = null;
    this.lastVertexGroupIndex = 0;
    this.lastNormalGroupIndex = 0;
    this.defaultGroup = new Group();
    this.activeGroup = this.defaultGroup;
    this.groups = {
      default: this.defaultGroup
    };
  }

  getGroupByName(name) {
    return this.groups[name];
  }

  parseString(str) {
    str.split("\n").forEach(line => {
      this.parseLine(line);
    });
  }

  /**
   * @returns {Group} representation of the input
   */
  toGroup() {
    const res = new Group();

    Object.keys(this.groups).forEach(g => {
      if (this.groups[g].shapes.length) {
        this.groups[g].name = g;
        res.addChild(this.groups[g]);
      }
    });

    // no reason for extra group nexting
    if (res.shapes.length === 1) {
      return res.shapes[0];
    }

    return res;
  }

  createGroup(name) {
    this.groups[name] = new Group();
    return this.groups[name];
  }

  getVertexByIndex(idx) {
    //console.log("getting vertex by index for ", idx);
    const startIndex = this.lastVertexGroupIndex;
    //console.log("indexing", startIndex + idx);
    return this.vertices[startIndex + idx];
  }

  getNormalByIndex(idx) {
    //console.log("getting vertex by index for ", idx);
    const startIndex = this.lastNormalGroupIndex;
    //console.log("indexing", startIndex + idx);
    return this.normals[startIndex + idx];
  }
  /**
   * @param {Array} parts
   * @returns {Point}
   */
  parseVertex(parts) {
    return point(Number(parts[1]), Number(parts[2]), Number(parts[3]));
  }

  /**
   * @param {Array} parts
   * @returns {Vector}
   */
  parseVector(parts) {
    return vector(Number(parts[1]), Number(parts[2]), Number(parts[3]));
  }

  parseFaceParts(parts) {
    return parts.filter(p => p.length > 0).map(p => {
      // handle vertex/texture/normal format
      if (p.indexOf('/') !== -1) {
        const triple = p.split('/');
        return {
          vertex: triple[0],
          texture: triple[1],
          normal: triple[2]
        }
      }
      return {
        vertex: p
      };
    });
  }

  triangulatePolygon(parts) {
    //console.log("triangulate parts", parts);
    const v1 = this.getVertexByIndex(Number(parts[1].vertex));
    const n1 = parts[1].normal ? this.getNormalByIndex(Number(parts[1].normal)) : null;
    const triangles = [];

    for (let index = 2; index < parts.length - 1; index++) {
      const v2 = this.getVertexByIndex(Number(parts[index].vertex));
      const v3 = this.getVertexByIndex(Number(parts[index+1].vertex));

      if (n1) {
        const n2 = this.getNormalByIndex(Number(parts[index].normal));
        const n3 = this.getNormalByIndex(Number(parts[index+1].normal));
        triangles.push(new SmoothTriangle(v1, v2, v3, n1, n2, n3));
      } else {
        triangles.push(new Triangle(v1, v2, v3));
      }
    }

    return triangles;
  }

  parseLine(line) {
    //console.log("parsing line", line);
    const parts = line.split(/(\s+)/).filter( e => e.trim().length > 0)
      .filter(c => c !== "\n").map(p => p.trim());
    const command = parts[0];

    //console.log("parts", parts);
    switch (command) {
      case "v":
        if (this.lastInstruction !== "v") {
          this.lastVertexGroupIndex = this.vertices.length - 1;
        }
        const p = this.parseVertex(parts);
        //console.log("parsed point", p);
        this.vertices.push(p);
        this.lastInstruction = "v";
        break;

      case "vn":
        if (this.lastInstruction !== "vn") {
          this.lastNormalGroupIndex = this.normals.length - 1;
        }
        const vp = this.parseVector(parts);
        this.normals.push(vp);
        this.lastInstruction = "vn";
        break;

      case "f":
        // if polygon
        //console.log("face", parts);
        const pparts = this.parseFaceParts(parts);
        //console.log("face parts", pparts);
        this.triangulatePolygon(pparts).forEach(triangle => {
          this.activeGroup.addChild(triangle);
        });

        this.lastInstruction = "f";
        break;

      case "g":
        const groupName = parts[1];
        let namedGroup = this.getGroupByName(groupName);

        if (!namedGroup) {
          namedGroup = this.createGroup(groupName);
        }

        this.activeGroup = namedGroup;
        break;

      default:
        this.ignoredLines.push(line);
        break;
    }
  }
}
