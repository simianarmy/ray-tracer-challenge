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
const RESOLUTION = 2;
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

    //const fpattern = new Checkers(
      //new SolidPattern(Color(1, 1, 1)),
      //new SolidPattern(Color(0, 0, 0))
    //);
    const fpattern = new SolidPattern(Color(0.2, 0.2, 0.1));
    fpattern.setTransform(multiply(rotationZ(0.5), scaling(0.9, 0.9, 0.9)));

    const floor = new Plane();
    floor.material.color = Color(1, 0.8, 0.8);
    floor.material.ambient = 0.2;
    floor.material.diffuse = 0.7;
    floor.material.reflective = 0.7;
    floor.material.pattern = fpattern;

    const backWall = new Plane();
    backWall.setTransform(
      multiply(translation(0, 0, 10), rotationX(Math.PI / 2))
    );
    backWall.material.pattern = new Ring(new SolidPattern(Color(0.2, 0, 0.2)), new SolidPattern(Color(1, 1, 0.5)));
    backWall.material.pattern.setTransform(multiply(rotationY(0.5), scaling(0.4, 0.4, 0.2)));

    const middle = Sphere.Glass();
    middle.setTransform(translation(-0.5, 1, 0.5));
    middle.material.color = Color(0.8, .4, 0.5);
    middle.material.ambient = 0.1;
    middle.material.diffuse = 0.2;
    middle.material.specular = 1.0;
    middle.material.shininess = 300;
    middle.material.transparency = 1;
    middle.material.reflective = 0.9;
    const mpattern = new Checkers(
      new SolidPattern(Color(0, 1, 0.2)),
      new SolidPattern(Color(0, 0.1, 1))
    );
    //middle.material.pattern = mpattern; //new Perturbed(mpattern);

    const right = Sphere.Glass();
    right.setTransform(
      multiply(translation(1.5, 0.5, -0.5), scaling(0.6, 0.6, 0.6))
    );
    right.material.color = Color(0.2, 0.2, 0.6);
    right.material.ambient = 0.1;
    right.material.diffuse = 0.3;
    right.material.specular = 1.0;
    const rpattern = new RadialGradient(
      new SolidPattern(Color.White),
      new SolidPattern(Color(0, 0.2, 0.5))
    );
    rpattern.setTransform(multiply(rotationZ(0.5), scaling(0.1, 0.1, 0.2)));
    //right.material.pattern = new Perturbed(rpattern);

    const left = Sphere.Glass();
    left.setTransform(
      multiply(translation(-1.5, .63, -0.75), scaling(0.6, 0.6, 0.6))
    );
    left.material.color = Color(0.4, 0.8, 0.1);
    left.material.diffuse = 0.1;
    left.material.ambient = 0.1;
    left.material.reflective = 0.4;
    middle.material.specular = 1.0;
    middle.material.shininess = 300;
    //left.material.pattern = new Stripe(
      //new SolidPattern(Color(0.2, 0.4, 1)),
      //new SolidPattern(Color(1, 0, 0))
    //);

    const world = World();
    world.objects = [floor, backWall, middle, right, left];
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
