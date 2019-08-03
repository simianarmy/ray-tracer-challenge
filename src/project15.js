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
const RESOLUTION = 3;
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
  room.setTransform(scaling(80, 80, 80));

  const hex = hexagon();
  hex.setTransform(translation(-0.5, 0.4, 2));

  const tgroup = new Group();

//[0, 3, 2] [0, 2, 1] [0,1, 4] [0, 4, 3] [4, 2, 3] [2, 4, 1]
  const tri1 = new Triangle(point(0, 0, 0), point(8, 0, 0), point(4, 9, 4));
  const tri2 = new Triangle(point(8, 0, 0), point(8, 0, 8), point(4, 9, 4));
  const tri3 = new Triangle(point(8, 0, 8), point(0, 0, 8), point(4, 9, 4));
  const tri4 = new Triangle(point(0, 0, 0), point(0, 0, 8), point(4, 9, 4));
  const tri5 = new Triangle(point(0, 0, 0), point(8, 0, 8), point(0, 0, 8));
  const tri6 = new Triangle(point(0, 0, 0), point(8, 0, 8), point(8, 0, 0));

  tgroup.addChild(tri1);
  tgroup.addChild(tri2);
  tgroup.addChild(tri3);
  tgroup.addChild(tri4);
  tgroup.addChild(tri5);
  tgroup.addChild(tri6);

  tgroup.setTransform(multiply(multiply(translation(-6, -10, 30), multiply(rotationY(Math.PI/2.5), rotationZ(-Math.PI/3))), scaling(1.0, 1.0, 1.0)));
  //tgroup.setTransform(multiply(translation(0, 1, 40), scaling(2.0, 2.0, 2.0)));
  tri1.material.pattern = new SolidPattern(Color.Green);
  tri2.material.pattern = new SolidPattern(Color.Black);
  tri3.material.pattern = new SolidPattern(Color.Red);
  tri4.material.pattern = new SolidPattern(Color.White);
  tri5.material.pattern = new SolidPattern(Color.Blue);
  tri6.material.pattern = new SolidPattern(Color(0.5, 0.5, 0.5));

  const world = World();
  world.objects = [room, /*hex,*/ tgroup];
  world.lightSource = PointLight(point(10, 50, -20), Color(1, 1, 1));

  const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, .785);
  camera.transform = viewTransform(
    point(0, 6, -12),
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
