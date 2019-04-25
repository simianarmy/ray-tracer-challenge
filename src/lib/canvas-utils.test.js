import { CanvasUtils } from "./canvas-utils";
import { Color } from "./color";

describe("CanvasUtils", () => {
  function initData(w, h, initValue) {
    let data = new Array(w * h);

    for (let i = 0; i < data.length; i++) {
      data[i] = initValue;
    }

    return data;
  }

  function initCanvas(w, h, initValue = Color(0, 0, 0)) {
    let data = initData(w, h, initValue);
    return CanvasUtils({ imgData: data, width: w, height: h });
  }

  beforeEach(() => {});

  it("writePixel sets color value of a single pixel", () => {
    let canvas = initCanvas(5, 5);
    canvas.writePixel(2, 3, "red");
    expect(canvas.getPixel(2, 3)).toEqual("red");
  });

  it("writePixel throws exception if coordinates are out of bounds", () => {
    let canvas = initCanvas(5, 5);
    expect(canvas.writePixel.bind(canvas, 6, 3)).toThrow();
  });

  describe("saving to PPM format", () => {
    it("constructs a valid header", () => {
      let canvas = initCanvas(5, 3);
      let ppm = canvas.saveToPPM();
      let lines = ppm.split("\n");
      expect(lines[0]).toEqual("P3");
      expect(lines[1]).toEqual("5 3");
      expect(lines[2]).toEqual("255");
    });

    it("constructs valid ppm pixel data", () => {
      let canvas = initCanvas(5, 3);
      canvas.writePixel(0, 0, Color(1.5, 0, 0));
      canvas.writePixel(2, 1, Color(0, 0.5, 0));
      canvas.writePixel(4, 2, Color(-0.5, 0, 1));
      let ppm = canvas.saveToPPM().split("\n");
      expect(ppm[3]).toEqual("255 0 0 0 0 0 0 0 0 0 0 0 0 0 0");
      expect(ppm[4]).toEqual("0 0 0 0 0 0 0 128 0 0 0 0 0 0 0");
      expect(ppm[5]).toEqual("0 0 0 0 0 0 0 0 0 0 0 0 0 0 255");
    });

    it("limits line length to 70", () => {
      let canvas = initCanvas(10, 2, Color(1, 0.8, 0.6));
      let ppm = canvas.saveToPPM().split("\n");
      expect(ppm[3]).toEqual(
        "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204"
      );
      expect(ppm[4]).toEqual(
        "153 255 204 153 255 204 153 255 204 153 255 204 153"
      );
      expect(ppm[5]).toEqual(
        "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204"
      );
      expect(ppm[6]).toEqual(
        "153 255 204 153 255 204 153 255 204 153 255 204 153"
      );
    });
  });
});
