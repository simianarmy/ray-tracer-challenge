/**
 * utilities for canvas object manipulation
 */
import { Color } from "./color";

const PPM_MAX_COLOR_VALUE = 255;
const scaleColorToPPM = (val) => {
  const v = Math.round(val * PPM_MAX_COLOR_VALUE);

  if (v < 0) {
    return 0;
  }

  return Math.min(v, PPM_MAX_COLOR_VALUE);
};
const colorToPPM_RGB = (c) => {
  const r = scaleColorToPPM(c.red);
  const g = scaleColorToPPM(c.green);
  const b = scaleColorToPPM(c.blue);
  return `${r} ${g} ${b}`;
};

export class ColorCanvas {
// Convert HTML5 2dcanvas
  static initFromHTMLCanvasContext = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    // convert RGBA pixel values to color tuples
    let convertedPixels = new Array(width * height);
    let data = imageData.data;

    for (let i=0, idx=0; i<data.length; i+=4, idx++) {
      const red = data[idx];
      const green = data[idx+1];
      const blue = data[idx+2];
      convertedPixels[idx] = Color(red, green, blue);
    }

    return new ColorCanvas(convertedPixels, width, height);
  }

  constructor(imgData, width, height) {
    this.data = imgData;
    this.width = width;
    this.height = height;
  }

  getData() {
    return this.data;
  }

  safe_xyToIndex(x, y) {
    if (!this.isInBounds(x, y)) {
      throw new Error("writePixel x y out of bounds");
    }

    return x + this.width * y;
  }

  indexToXY(i) {
    const x = Math.floor(i % this.width);
    const y = Math.floor(i / this.width);
    return [x, y];
  }

  // Pixel functions
  writePixel(x, y, color) {
    this.data[this.safe_xyToIndex(x, y)] = color;
  }

  getPixel(x, y) {
    return this.data[this.safe_xyToIndex(x, y)];
  }

  isInBounds(x, y) {
    return (x >= 0 && x < this.width && y >= 0 && y < this.height);
  }

  // HTML5 canvas conversion functions

  toHTML5CanvasImageData() {
    let pixels = new Uint8ClampedArray (this.width * this.height * 4);

    for (let i=0, pi=0; i<this.data.length; i++, pi+=4) {
      pixels[pi] = this.data[i].red;
      pixels[pi+1] = this.data[i].green;
      pixels[pi+2] = this.data[i].blue;
      pixels[pi+3] = 0;
    }

    return new ImageData(pixels, this.width, this.height);
  };

  saveToPPM() {
    function findSafeLineEnd(line) {
      let index = 70;

      while (line[index] !== " ") {
        index--;
      }

      return index;
    }

    const header = `P3\n${this.width} ${this.height}\n${PPM_MAX_COLOR_VALUE}`;
    let rgbValues = this.data.map(colorToPPM_RGB);
    let body = "";

    for (let i = 0; i < this.height; i++) {
      let rgbs = [];

      for (let j = 0; j < this.width; j++) {
        rgbs.push(rgbValues[this.safe_xyToIndex(j, i)]);
      }

      let line = rgbs.join(" ");

      while (line.length > 70) {
        let lineEndIndex = findSafeLineEnd(line);
        let splitLine1 = line.slice(0, lineEndIndex);

        body += splitLine1 + "\n";
        line = line.slice(lineEndIndex + 1);
      }

      body += line + "\n";
    }

    return `${header}\n${body}`;
  }
}

