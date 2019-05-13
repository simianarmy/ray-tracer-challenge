import React from "react";

import { saveAs } from 'file-saver';

import { ColorCanvas } from "./lib/color-canvas";
import { point, sub, negate, normalize } from "./lib/tuple";
import { Ray, position } from "./lib/ray";
import { Sphere } from "./lib/sphere";
import { Color } from "./lib/color";
import { lighting } from "./lib/material";
import { PointLight } from "./lib/light";
import { hit } from "./lib/intersection";
import "./App.css";

const ColorBlack = Color(0, 0, 0);

class Animation extends React.Component {
  castRays() {
    const {
      canvas,
      canvasPixels,
      pixelSize,
      rayOrigin,
      light,
      sphere,
      wallSize,
      wallZ
    } = this.state;

    const half = wallSize / 2;

    for (let y = 0; y < canvasPixels; y++) {
      // compute the world y coordinate (top = +half, bottom = -half)
      let worldY = half - pixelSize * y;

      for (let x = 0; x < canvasPixels; x++) {
        let worldX = -half + pixelSize * x;

        // cast ray to pixel on wall
        const wallPoint = point(worldX, worldY, wallZ);
        const ray = Ray(rayOrigin, normalize(sub(wallPoint, rayOrigin)));
        const xs = sphere.intersect(ray);

        // if intersections, color the pixel
        if (xs.length > 0) {
          // find normal at hit
          const closest = hit(xs);
          //console.log("ray intersects sphere at ", closest);
          const hitPos = position(ray, closest.t);
          const normal = closest.object.normalAt(hitPos);

          // calculate eye vector?
          const eye = negate(ray.direction);

          // calculate color at hit point
          const surfaceColor = lighting(closest.object.material, light, hitPos, eye, normal);
          canvas.writePixel(x, y, surfaceColor);
        }
      }
    }

    this.setState({ ready: true, imgData: canvas.saveToPPM() });
  }

  constructor(props) {
    super(props);

    const rayOrigin = point(0, 0, -5);
    //const light = PointLight(point(-10, 10, -10), Color(1, 1, 1));
    const light = PointLight(point(5, 20, -2), Color(0.2, 0.5, 1));
    const wallZ = 10;
    const wallSize = 7;
    const canvasPixels = 200;
    const pixelSize = wallSize / canvasPixels;
    const sphere = Sphere(); // unit sphere at origin
    //const m = scaling(0.9, 0.8, 1);
    //sphere.setTransform(m);
    sphere.material.color = Color(0.5, 0.8, 0.7);
    //sphere.material.diffuse = 0.4;
    //sphere.material.specular = 0.2;
    let wallCanvas = new ColorCanvas(canvasPixels, canvasPixels, ColorBlack);

    this.state = {
      canvas: wallCanvas,
      canvasPixels,
      rayOrigin,
      light,
      sphere,
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
    if (this.state.ready) {
      let blob = new Blob([this.state.imgData], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "project6.ppm");
    }

    return this.state.ready ? (
      <div>
        <h1>File generated</h1> (project6.ppm)
      </div>
    ) : (
      <h1>Generating...</h1>
    );
  }
}

function Project6() {
  return (
    <div className="App project">
      <header className="App-header">
        <h1>Project 6</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project6;
