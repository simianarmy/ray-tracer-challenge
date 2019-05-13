import React from "react";

import { ColorCanvas } from "./lib/color-canvas";
import { point, sub, normalize } from "./lib/tuple";
import { Ray } from "./lib/ray";
import { Sphere } from "./lib/sphere";
import { Color } from "./lib/color";
import "./App.css";

const ColorBlack = Color(0, 0, 0);

class Animation extends React.Component {
  castRays() {
    const {
      canvas,
      canvasPixels,
      pixelSize,
      rayOrigin,
      sphere,
      sphereColor,
      wallSize,
      wallZ
    } = this.state;

    const half = wallSize / 2;

    for (let y = 0; y < canvasPixels; y++) {
      // compute the world y coordinate (top = +half, bottom = -half)
      let worldY = half - pixelSize * y;

      for (let x = 0; x < canvasPixels; x++) {
        let worldX = -half + pixelSize * x;

        // cast ray from lightsource to pixel on wall
        const wallPoint = point(worldX, worldY, wallZ);
        const ray = Ray(rayOrigin, normalize(sub(wallPoint, rayOrigin)));
        const xs = sphere.intersect(ray);
        // if intersections, color the pixel
        if (xs.length > 0) {
          canvas.writePixel(x, y, sphereColor);
        }
      }
    }

    this.setState({ ready: true, imgData: canvas.saveToPPM() });
  }

  constructor(props) {
    super(props);

    const rayOrigin = point(0, 0, -5);
    const wallZ = 10;
    const wallSize = 7;
    const canvasPixels = 100;
    const pixelSize = wallSize / canvasPixels;
    const sphere = Sphere(); // unit sphere at origin
    let wallCanvas = new ColorCanvas(canvasPixels, canvasPixels, ColorBlack);

    this.state = {
      canvas: wallCanvas,
      canvasPixels,
      rayOrigin,
      sphere,
      sphereColor: Color(1, 0, 0),
      wallZ,
      wallSize,
      pixelSize,
      imgData: null,
      ready: false,
      lastPixel: 0
    };
  }

  componentDidMount() {
    this.castRays();
  }

  render() {
    return this.state.ready ? (
      <div>
        <div className="ppmdata">
          <textarea rows="20" cols="60" readOnly value={this.state.imgData} />
        </div>
      </div>
    ) : (
      <h1>Generating...</h1>
    );
  }
}

function Project4() {
  return (
    <div className="App project">
      <header className="App-header">
        <h1>Project 5</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project4;
