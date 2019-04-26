/**
 * utilities for canvas object manipulation
 */

export const CanvasUtils = ({ imgData, width, height }) => {
  let data = imgData;

  const getData = () => data;

  const safe_xyToIndex = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      throw new Error("writePixel x y out of bounds");
    }

    return x + width * y;
  };

  // Pixel functions
  const writePixel = (x, y, color) => {
    data[safe_xyToIndex(x, y)] = color;
  };

  const getPixel = (x, y) => data[safe_xyToIndex(x, y)];

  // PPM functions
  const PPM_MAX_COLOR_VALUE = 255;

  const scaleColorToPPM = val => {
    const v = Math.round(val * PPM_MAX_COLOR_VALUE);

    if (v < 0) {
      return 0;
    }

    return Math.min(v, PPM_MAX_COLOR_VALUE);
  };

  const colorToPPM_RGB = c => {
    const r = scaleColorToPPM(c.red);
    const g = scaleColorToPPM(c.green);
    const b = scaleColorToPPM(c.blue);
    return `${r} ${g} ${b}`;
  };

  const saveToPPM = () => {
    function findSafeLineEnd(line) {
      let index = 70;

      while (line[index] !== " ") {
        index--;
      }

      return index;
    }

    const header = `P3\n${width} ${height}\n${PPM_MAX_COLOR_VALUE}`;
    let rgbValues = data.map(colorToPPM_RGB);
    let body = "";

    for (let i = 0; i < height; i++) {
      let rgbs = [];

      for (let j = 0; j < width; j++) {
        rgbs.push(rgbValues[safe_xyToIndex(j, i)]);
      }
      let line = rgbs.join(" ");

      if (line.length > 70) {
        let lineEndIndex = findSafeLineEnd(line);
        let splitLine1 = line.slice(0, lineEndIndex);
        let splitLine2 = line.slice(lineEndIndex + 1);
        body += splitLine1 + "\n";
        body += splitLine2 + "\n";
      } else {
        body += line + "\n";
      }
    }

    return `${header}\n${body}`;
  };

  return {
    getData,
    writePixel,
    getPixel,
    saveToPPM
  };
};
