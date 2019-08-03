/**
 * Project 15
 * Demonstrate use of Groups by rendering a hexagon shape
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
  Cone,
  Group,
  Triangle
} from "./lib/index";
import { multiply } from "./lib/matrix";
import { Scene } from "./components/scene";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 15";
const HSIZE = 100;
const VSIZE = 100;
const RESOLUTION = 1;
const CANVAS_SCALE = 2;

function Project15() {
  function hexCorner() {
    const corner = new Sphere();
    corner.setTransform(multiply(translation(0, 0, -1), scaling(0.25, 0.25, 0.25)));

    return corner;
  }

  function hexEdge() {
    const edge = new Cylinder();

    edge.minimum = 0;
    edge.maximum = 1;
    edge.setTransform(multiply(translation(0, 0, -1),
      multiply(rotationY(-Math.PI/6),
        multiply(rotationZ(-Math.PI/2),
          scaling(0.25, 1, 0.25)))));

    return edge;
  }

  function hexSide() {
    const side = new Group();

    side.addChild(hexCorner());
    side.addChild(hexEdge());

    return side;
  }

  function hexagon() {
    const hex = new Group();

    for (let n = 0; n <= 5; n++) {
      let side = hexSide();
      side.setTransform(rotationY(n * (Math.PI / 3)));
      hex.addChild(side);
    }

    return hex;
  }

  const fpattern = new SolidPattern(Color(0.8, 0.8, 0.8));

  const room = new Cube();
  room.material.reflective = 0;
  room.material.pattern = fpattern;
  room.setTransform(multiply(rotationY(Math.PI/1.2), scaling(80, 80, 80)));

  const hex = hexagon();
  hex.setTransform(translation(-0.5, 0.4, 2));

  const tgroup = new Group();

  const tri1 = new Triangle(point(0, 0, 0), point(8, 0, 0), point(4, 4, 9));
  const tri2 = new Triangle(point(8, 0, 0), point(8, 8, 0), point(4, 4, 9));
  const tri3 = new Triangle(point(8, 8, 0), point(0, 8, 0), point(4, 4, 9));
  const tri4 = new Triangle(point(0, 0, 0), point(0, 8, 0), point(4, 4, 9));

  tgroup.addChild(tri1);
  tgroup.addChild(tri2);
  tgroup.addChild(tri3);
  tgroup.addChild(tri4);

  tgroup.setTransform(multiply(multiply(translation(0, 2, 0), rotationY(Math.PI/1.5)), scaling(2.5, 2.5, 2.5)));
  tri1.material.pattern = new SolidPattern(Color(0.8, 0.2, 0.8));
  tri2.material.pattern = new SolidPattern(Color(0.6, 0.2, 0.3));
  tri3.material.pattern = new SolidPattern(Color(0.4, 0.4, 0.8));
  tri4.material.pattern = new SolidPattern(Color(0.2, 0.8, 0.8));

  const world = World();
  world.objects = [room, /*hex,*/ tgroup];
  world.lightSource = PointLight(point(10, 50, -20), Color(1, 1, 1));

  const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, .785);
  camera.transform = viewTransform(
    point(0, 6, -10),
    point(0, 0, 6),
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

export default Project15;
