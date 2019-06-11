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
} from "./lib/index";
import { multiply } from "./lib/matrix";
import { Scene } from "./components/scene";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 12";
const HSIZE = 100;
const VSIZE = 50;
const RESOLUTION = 2;
const CANVAS_SCALE = 4;

function Project12() {

    // pond surface
    const water = new Plane();
    water.material.color = Color(0.1, 0.1, 0.7);
    water.material.ambient = 0.2;
    water.material.diffuse = 0.7;
    water.material.reflective = 0.5;
    water.material.transparency = 1;
    water.setTransform(translation(0, 1, 0));

  // pond floor
  const floor = new Plane();

  const fpattern = new Checkers(new SolidPattern(Color(0.2, 0.2, 0.1)),
    new SolidPattern(Color(0.9, 0.6, 0.2)));
  floor.material.pattern = fpattern;

    const backWall = new Plane();
    backWall.setTransform(
      multiply(translation(0, 0, 15), rotationX(Math.PI / 2))
    );
    backWall.material.color = Color(0.1, 0.5, 0.1);

  const wpattern = new Checkers(new SolidPattern(Color.White),
    new SolidPattern(Color(1, 0, 0)));
  backWall.material.pattern = wpattern;
  backWall.material.pattern.setTransform(scaling(0.3, 0.3, 0.3));

    // rocks under surface
    const middle = new Sphere();
    middle.setTransform(multiply(translation(-0.5, 0.4, .5), scaling(0.6, 0.6, 0.6)));
    middle.material.color = Color(0.8, .4, 0.5);
    middle.material.ambient = 0.9;
    middle.material.diffuse = 0.7;
    middle.material.specular = 1.0;
    middle.material.shininess = 300;
    //middle.material.transparency = 0.7;
    //middle.material.reflective = 0.9;
    //const mpattern = new Checkers(
      //new SolidPattern(Color(0, 1, 0.2)),
      //new SolidPattern(Color(0, 0.1, 1))
    //);

    const left = Sphere.Glass();
    left.setTransform(
      multiply(translation(-1.5, 0, 0.75), scaling(0.3, 0.3, 0.3))
    )
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
    world.objects = [water, floor, backWall, middle];
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

export default Project12;
