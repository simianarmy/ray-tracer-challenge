import React from "react";

import {
  point,
  vector,
  World,
  Plane,
  Sphere,
  Color,
  PointLight,
  scaling,
  translation,
  rotationX,
  rotationY,
  rotationZ,
  viewTransform,
  Camera,
  Stripe,
  Gradient,
  RadialGradient,
  Ring,
  Checkers,
  Blended,
  Perturbed,
  SolidPattern,
  render
} from "./lib/index";
import { multiply } from "./lib/matrix";
import { FileDownloadButton } from "./components/file-download-button";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 11";
const HSIZE = 100;
const VSIZE = 50;
const RESOLUTION = 3;
const CANVAS_SCALE = 2;

class Animation extends React.Component {
  castRays() {
    const { camera, world } = this.state;

    // synchronous render, result is fully rendered world
    const canvas = render(camera, world);
    const ppmData = canvas.saveToPPM();

    // draw ppm to canvas for preview, scaled up
    const previewCanvas = document.querySelector("#ppmPreview");
    var ctx = previewCanvas.getContext("2d");
    const imageData = canvas.toHTML5CanvasImageData();

    ctx.putImageData(imageData, 0, 0);

    let tmpCanvas = document.querySelector("#tempCanvas");
    tmpCanvas.width = imageData.width * CANVAS_SCALE;
    tmpCanvas.height = imageData.height * CANVAS_SCALE;
    tmpCanvas
      .getContext("2d")
      .drawImage(
        previewCanvas,
        0,
        0,
        imageData.width,
        imageData.height,
        0,
        0,
        imageData.width * CANVAS_SCALE,
        imageData.height * CANVAS_SCALE
      );

    this.setState({
      ready: true,
      imgBlob: new Blob([ppmData], { type: "text/plain;charset=utf-8" }),
      imgFileName: `${ProjectTitle}.ppm`
    });
  }

  constructor(props) {
    super(props);

    let stripe1 = new Stripe(
      new SolidPattern(Color(0.2, 0.4, 0.5)),
      new SolidPattern(Color(1, 1, 1))
    );
    stripe1.setTransform(multiply(rotationY(0.5), scaling(0.2, 0.2, 0.2)));
    const stripe2 = new Stripe(
      new SolidPattern(Color(0, 0.5, 0.8)),
      new SolidPattern(Color(1, 0, 0.2))
    );
    stripe2.setTransform(multiply(rotationY(-0.5), scaling(0.1, 0.1, 0.1)));

    const floor = new Plane();
    floor.material.color = Color(1, 0.9, 0.9);
    floor.material.specular = 0;
    floor.material.reflective = 0.9;
    floor.material.transparency = 0.4;
    floor.material.refractiveIndex = 2;
    //floor.material.pattern = new Perturbed(new Blended(stripe1, stripe2));

    const middle = new Sphere();
    middle.setTransform(translation(-0.5, 1, 0.5));
    middle.material.color = Color(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;
    middle.material.transparency = 0.7;
    middle.material.refractiveIndex = 1.5;
    const mpattern = new Checkers(
      new SolidPattern(Color(0, 1, 0.2)),
      new SolidPattern(Color(0, 0.1, 1))
    );
    mpattern.setTransform(multiply(rotationZ(0.5), scaling(0.4, 0.4, 0.4)));
    //middle.material.pattern = mpattern; //new Perturbed(mpattern);

    const right = new Sphere();
    right.setTransform(
      multiply(translation(1.5, 0.5, -0.5), scaling(0.5, 0.5, 0.5))
    );
    right.material.color = Color(0.5, 1, 0.1);
    right.material.diffuse = 0.3;
    right.material.specular = 0.7;
    right.material.reflective = 0.8;
    const rpattern = new RadialGradient(
      new SolidPattern(Color.White),
      new SolidPattern(Color(0, 0.2, 0.5))
    );
    rpattern.setTransform(multiply(rotationZ(0.5), scaling(0.1, 0.1, 0.2)));
    //right.material.pattern = new Perturbed(rpattern);

    const left = new Sphere();
    left.setTransform(
      multiply(translation(-1.5, 0.33, -0.75), scaling(0.33, 0.33, 0.33))
    );
    left.material.color = Color(1, 0.8, 0.1);
    left.material.diffuse = 0.1;
    left.material.specular = 0.1;
    left.material.ambient = 0.8;
    left.material.pattern = new Gradient(
      new SolidPattern(Color(0.2, 0.4, 1)),
      new SolidPattern(Color(1, 0, 0))
    );

    const world = World();
    world.objects = [floor, middle, right, left];
    world.lightSource = PointLight(point(-10, 10, -10), Color(1, 1, 1));

    const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, Math.PI / 3);
    camera.transform = viewTransform(
      point(0, 1.5, -5),
      point(0, 1, 0),
      vector(0, 1, 0)
    );

    this.state = {
      world,
      camera,
      imgBlob: null,
      ready: false
    };
  }

  componentDidMount() {
    // let initial scene render before hogging the cpu
    setTimeout(() => {
      this.castRays();
    }, 1000);
  }

  render() {
    const { ready, camera } = this.state;

    return (
      <>
        {ready || (
          <>
            <h1>Generating...</h1>
            <canvas
              id="ppmPreview"
              width={camera.hsize}
              height={camera.vsize}
              style={{ marginTop: "32px" }}
            />
          </>
        )}
        <canvas id="tempCanvas" />
        {ready && (
          <>
            <FileDownloadButton
              fileBlob={this.state.imgBlob}
              fileName={this.state.imgFileName}
            />
          </>
        )}
      </>
    );
  }
}

function Project6() {
  return (
    <div className="App project">
      <header className="App-header">
        <h1>{ProjectTitle}</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project6;
