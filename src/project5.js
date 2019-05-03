import React from "react";

import { ColorCanvas } from "./lib/color-canvas";
import { point, vector, sub } from "./lib/tuple";
import { Ray, intersect } from "./lib/ray";
import { Sphere } from "./lib/sphere";
import { Color } from "./lib/color";
import "./App.css";

const Black = Color(0, 0, 0);

class Animation extends React.Component {
  castRays() {
    const { canvas, canvasPixels, lightSource, sphere, sphereColor, wallZ } = this.state;

    for (let i=0; i<canvasPixels; i++) {
      for (let j=0; j<canvasPixels; j++) {
        // cast ray from lightsource to pixel on wall
        const wallPoint = point(i, j, wallZ);
        console.log("wall point", wallPoint);
        const lightToPixelVec = sub(wallPoint, lightSource.origin);
        console.log("light to pixel", i, j, lightToPixelVec);
        const ray = Ray(lightSource, lightToPixelVec);
        const xs = intersect(sphere, ray);
        // if intersections, color the pixel
        if (xs.length > 0) {
          canvas.writePixel(i, j, sphereColor);
        } else {
          // otherwise pixel is black
          canvas.writePixel(i, j, Black);
        }
      }
    }

    this.setState({ready: true, imgData: canvas.saveToPPM()});
  }

  constructor(props) {
    super(props);

    const lightSource = Ray(point(0, 0, -5), vector(0, 0, 1));
    const wallZ = 10;
    const wallSize = 7;
    const canvasPixels = 100;
    const pixelSize = wallSize / canvasPixels;
    const sphere = Sphere();
    let wallCanvas = new ColorCanvas(new Array(canvasPixels * canvasPixels), canvasPixels, canvasPixels);

    this.state = {
      canvas: wallCanvas,
      lightSource,
      sphere,
      sphereColor: Color(1, 0, 0),
      wallZ,
      wallSize,
      canvasPixels,
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
    return (
      this.state.ready ? (
      <div>
        <div className="ppmdata">
          <textarea rows="20" cols="60" value={this.state.imgData} />
        </div>
      </div>
      ) : <h1>Generating...</h1>
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
