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
  Cube
} from "./lib/index";
import { multiply } from "./lib/matrix";
import { Scene } from "./components/scene";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 13";
const HSIZE = 100;
const VSIZE = 50;
const RESOLUTION = 2;
const CANVAS_SCALE = 4;

function Project6() {
    const fpattern = new SolidPattern(Color(0.2, 0.2, 0.1));
    fpattern.setTransform(multiply(rotationZ(0.5), scaling(0.9, 0.9, 0.9)));

    const cube = new Cube();
    cube.setTransform(multiply(multiply(translation(-0.5, 0, 1.5), rotationY(0.5)), rotationX(0.2)));
    cube.material.color = Color(0.2, .4, 0.5);
    cube.material.ambient = 0.1;
    cube.material.diffuse = 0.2;
    cube.material.specular = 1.0;
    cube.material.shininess = 300;
    cube.material.transparency = 0.7;
    cube.material.reflective = 0.9;
    const mpattern = new Checkers(
      new SolidPattern(Color(0, 1, 0.2)),
      new SolidPattern(Color(0, 0.1, 1))
      );
    //cube.pattern = mpattern;

    const world = World();
    world.objects = [cube];
    world.lightSource = PointLight(point(-10, 10, -10), Color(1, 1, 1));

    const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, Math.PI / 3);
    camera.transform = viewTransform(
      point(0, 1.5, -5),
      point(0, 1, 0),
      vector(0, 1, 0)
    );

  return (
    <div className="App project">
      <header className="App-header">
        <h1>{ProjectTitle}</h1>
        <Scene width="700" height="550" world={world} camera={camera} title={ProjectTitle} canvasScale={CANVAS_SCALE} />
      </header>
    </div>
  );
}

export default Project6;
