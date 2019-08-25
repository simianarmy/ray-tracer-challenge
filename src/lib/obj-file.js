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
 * @param {Object} parse options
 * @returns {Parser}
 */
export function parseObjFile(input, opts = {}) {
  const parser = new Parser(opts);

  parser.parseString(input);

  return parser;
}

class GroupData {
  constructor() {
    this.vertexIndex = 0;
    this.normalIndex = 0;
    this.instructions = [];
    this.group = new Group();
  }

  addTriangle(t) {
    this.group.addChild(t);
  }
}

class Parser {
  constructor(opts = {}) {
    this.ignoredLines = [];
    this.vertices = [null];
    this.normals = [null];
    this.faces = {};
    this.lastInstruction = null;
    this.lastVertexGroupIndex = 0;
    this.lastNormalGroupIndex = 0;
    this.defaultGroup = new GroupData();
    this.activeGroup = this.defaultGroup;
    this.normalize = opts.normalize;
    this.groups = {
      default: this.defaultGroup
    };
  }

  getDefaultGroup() {
    return this.groups.default.group;
  }

  getGroupByName(name) {
    return this.getGroupDataByName(name).group;
  }

  getGroupDataByName(name) {
    return this.groups[name];
  }

  parseString(str) {
    str.split("\n").forEach(line => {
      this.parseLine(line);
    });
    // normalize vertices to unit bounding box at (-1,-1,-1) (1, 1, 1)
    if (this.normalize) {
      this.normalizeVertices();
    }
    /**
     * TODO: Get this to work!
     */
    this.addTriangles();
  }

  /**
   * Returns bounding box of all vertices
   */
  getExtents() {
    // min/max x, y, z
    const verts = this.vertices.slice(1);
    return {
      minX: Math.min.apply(null, verts.map(p => p.x)),
      maxX: Math.max.apply(null, verts.map(p => p.x)),
      minY: Math.min.apply(null, verts.map(p => p.y)),
      maxY: Math.max.apply(null, verts.map(p => p.y)),
      minZ: Math.min.apply(null, verts.map(p => p.z)),
      maxZ: Math.max.apply(null, verts.map(p => p.z)),
    };
  }

  /**
   * @returns {Group} representation of the input
   */
  toGroup() {
    const res = new Group();

    Object.keys(this.groups).forEach(g => {
      if (this.groups[g].group.shapes.length) {
        this.groups[g].name = g;
        res.addChild(this.groups[g].group);
      }
    });

    // no reason for extra group nexting
    if (res.shapes.length === 1) {
      return res.shapes[0];
    }

    return res;
  }

  createGroupData(name) {
    this.groups[name] = new GroupData();
    return this.groups[name];
  }

  normalizeVertices() {
    const extents = this.getExtents();
    const sx = extents.maxX - extents.minX;
    const sy = extents.maxY - extents.minY;
    const sz = extents.maxZ - extents.minZ;
    const scale = Math.max(sx, sy, sz) / 2;

    for (let i=1; i<this.vertices.length; i++) {
      let v = this.vertices[i];
      v.x = (v.x - (extents.minX + sx/2)) / scale;
      v.y = (v.y - (extents.minY + sy/2)) / scale;
      v.z = (v.z - (extents.minZ + sz/2)) / scale;
    }
  }

  /**
   * TODO: Get this to work!
   */
  addTriangles() {
    //console.log("face parts", pparts);
    Object.keys(this.groups).forEach(gname => {
      const gd = this.groups[gname];

      if (gd.instructions.length) {
        this.activeGroup = gd;

        //console.log("parsing face instructions", gd.instructions);
        gd.instructions.forEach(face => {
          this.triangulatePolygon(face).forEach(triangle => {
            gd.addTriangle(triangle);
          });
        });
      }
    });
  }

  getVertexByIndex(idx) {
    //console.log("getting vertex by index for ", idx);
    const startIndex = this.activeGroup.vertexIndex;
    //console.log("indexing", startIndex + idx);
    return this.vertices[startIndex + idx];
  }

  getNormalByIndex(idx) {
    //console.log("getting vertex by index for ", idx);
    const startIndex = this.activeGroup.normalIndex;
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

  /**
   * @returns {Array[Triangle]}
   */
  triangulatePolygon(parts) {
    //console.log("triangulating", parts);
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
          this.activeGroup.vertexIndex = this.vertices.length - 1;
        }
        const p = this.parseVertex(parts);
        //console.log("parsed point", p);
        this.vertices.push(p);
        this.lastInstruction = "v";
        break;

      case "vn":
        if (this.lastInstruction !== "vn") {
          this.activeGroup.normalIndex = this.normals.length - 1;
        }
        const vp = this.parseVector(parts);
        this.normals.push(vp);
        this.lastInstruction = "vn";
        break;

      case "f":
        // if polygon
        //console.log("face", parts);
        const pparts = this.parseFaceParts(parts);

        this.activeGroup.instructions.push(pparts);
        this.lastInstruction = "f";
        break;

      case "g":
        const groupName = parts[1];
        let namedGroup = this.getGroupDataByName(groupName);

        if (!namedGroup) {
          namedGroup = this.createGroupData(groupName);
        }

        this.activeGroup = namedGroup;
        break;

      default:
        this.ignoredLines.push(line);
        break;
    }
  }
}
