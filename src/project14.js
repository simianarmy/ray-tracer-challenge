/**
 * Project 14
 * Create complex object using all shapes:
 * Cubes, Cones, Cylinders, etc
 */
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
  Cube,
  Cylinder,
  Cone
} from "./lib/index";
import { multiply } from "./lib/matrix";
import { Scene } from "./components/scene";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 14";
const HSIZE = 200;
const VSIZE = 100;
const RESOLUTION = 2;
const CANVAS_SCALE = 4;

function Project14() {
  const fpattern = new SolidPattern(Color(0.4, 0.4, 0.8));
  //fpattern.setTransform(multiply(rotationZ(0.5), scaling(0.9, 0.9, 0.9)));

  const room = new Cube();
  room.material.reflective = 0;
  room.material.pattern = fpattern;
  //room.setTransform(multiply(multiply(rotationY(-0.2), scaling(10, 10, 10)), translation(0, 0, -2)));
  room.setTransform(multiply(multiply(translation(0, 4, -2), rotationY(1)), scaling(8, 8, 8)));

  const cone = new Cone();
  cone.maximum = 1.6;
  cone.setTransform(multiply( translation(0, -1.0, 1.0), scaling(0.3, 1, 1)));
  cone.material.ambient = 0.9;
  cone.material.diffuse = 0.2;
  cone.material.specular = 1.0;
  cone.material.shininess = 300;
  const mpattern = new Checkers(
    new SolidPattern(Color.White),
    new SolidPattern(Color(139/255, 69/255, 19/255))
  );
  mpattern.setTransform(scaling(0.1, 0.2, 0.2));
  cone.material.pattern = mpattern;

  const scoop = new Sphere();
  scoop.setTransform(multiply( translation(0, 1.4, .5), scaling(0.5, 0.4, 0.5)));
  scoop.material.specular = 0.2;
  const spattern = new Gradient(new SolidPattern(Color(1, 105/255, 180/255)), new SolidPattern(Color(1, 182/255, 193/255)));
  spattern.setTransform(multiply(rotationY(Math.PI/2), rotationX(Math.PI / 3)));
  scoop.material.pattern = spattern;

  const scoop2 = new Sphere();
  scoop2.setTransform(multiply(translation(0, 0.7, .5), scaling(0.5, 0.4, 0.5) ));
  scoop2.material.specular = 0.2;
  const spattern2 = new Gradient(new SolidPattern(Color(144/255, 238/255, 144/255)), new SolidPattern(Color.White));
  spattern2.setTransform(multiply(rotationY(Math.PI/4), rotationX(Math.PI / 2)));
  scoop2.material.pattern = spattern2;

  const world = World();
  world.objects = [room, cone, scoop, scoop2];
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

export default Project14;
