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
const HSIZE = 200;
const VSIZE = 100;
const RESOLUTION = 2;
const CANVAS_SCALE = 4;

function Project13() {
  const fpattern = new SolidPattern(Color(0.4, 0.4, 0.8));
  //fpattern.setTransform(multiply(rotationZ(0.5), scaling(0.9, 0.9, 0.9)));

  const room = new Cube();
  room.material.ambient = 0.2;
  room.material.reflective = 0.3;
  room.material.pattern = fpattern;
  //room.setTransform(multiply(multiply(rotationY(-0.2), scaling(10, 10, 10)), translation(0, 0, -2)));
  room.setTransform(multiply(multiply(translation(0, 4, -2), rotationY(1)), scaling(8, 8, 8)));

  const cube = new Cube();
  cube.setTransform(multiply(multiply(translation(-1.5, 0.3, 2.5), rotationY(-0.5)), rotationX(0.2)));
  cube.material.ambient = 0.9;
  cube.material.diffuse = 0.2;
  cube.material.specular = 1.0;
  cube.material.shininess = 300;
  const mpattern = new Checkers(
    new SolidPattern(Color.White),
    new SolidPattern(Color.Black)
  );
  mpattern.setTransform(scaling(0.2, 0.2, 0.2));
  cube.material.pattern = mpattern;

  const cube2 = new Cube();
  cube2.setTransform(multiply(multiply(translation(2, 0.4, 2), rotationY(-0.5)), scaling(0.5, 0.5, 0.5)));
  cube2.material.color = Color(0, 0, 0.8);
  cube2.material.ambient = 0.2;
  cube2.material.reflective = 0.7;

  const cube3 = new Cube();
  cube3.setTransform(multiply(multiply(multiply(multiply(translation(.5, .8, 2), rotationX(-0.5)), rotationY(Math.PI/4)), rotationZ(0.6)), scaling(3.5, 0.2, 0.2)));
  const rpattern = new RadialGradient(
    new SolidPattern(Color.White),
    new SolidPattern(Color(0, 0.2, 0.5))
  );
  cube3.material.pattern = rpattern;
  cube3.material.transparency = 0.5;

  const world = World();
  world.objects = [room, cube, cube2, cube3];
  world.lightSource = PointLight(point(-6, 6, -6), Color(1, 1, 1));

  const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, Math.PI / 3);
  camera.transform = viewTransform(
    point(0, 1.5, -7),
    point(0, 0, 1),
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

export default Project13;
