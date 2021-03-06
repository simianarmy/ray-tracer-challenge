import React from "react";

import {  point, vector, World, Plane, Sphere, Color, PointLight, scaling, translation, rotationX, rotationZ, viewTransform, Camera, Stripe, render  } from "./lib/index";
import { multiply } from "./lib/matrix";
import { FileDownloadButton } from "./components/file-download-button";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 9";
const HSIZE = 100;
const VSIZE= 50;
const RESOLUTION = 4;

class Animation extends React.Component {
  castRays() {
    const {
      camera,
      world
    } = this.state;

    const canvas = render(camera, world);

    this.setState({
      imgBlob: new Blob([canvas.saveToPPM()], {type: "text/plain;charset=utf-8"}),
      ready: true,
      imgFileName: `${ProjectTitle}.ppm`
    });
  }

  constructor(props) {
    super(props);

    const floor = new Plane();
    floor.material.color = Color(1, 0.9, 0.9);
    floor.material.specular = 0;
    floor.material.pattern = new Stripe(Color(1, 0.5, 0.2), Color(0, 0, 0));
    floor.material.pattern.setTransform(scaling(0.1, 0.1, 0.2));

    const backWall = new Plane();
    backWall.setTransform(
      multiply(
        translation(0, 0, 10),
        rotationX(Math.PI / 2)
      )
    );
    backWall.material = floor.material;

    /*
    const rightWall = Sphere();
    const trans =
      multiply(
        multiply(
          multiply(
            translation(0, 0, 5),
            rotationY(Math.PI / 4)
          ),
          rotationX(Math.PI / 2)
        ),
        scaling(10, 0.01, 10)
        );
    rightWall.setTransform(trans);
    rightWall.material = floor.material;
    */

    const middle = new Sphere();
    middle.setTransform(translation(-0.5, 1, 0.5));
    middle.material.color = Color(.1, 1, .5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;
    middle.material.pattern = new Stripe(Color(1, 0, 0.2), Color(0, 0, 1));
    middle.material.pattern.setTransform(multiply(rotationZ(0.5), scaling(0.1, 0.1, 0.2)));

    const right = new Sphere();
    right.setTransform(multiply(translation(1.5, .5, -0.5),
      scaling(0.5, 0.5, 0.5)));
    right.material.color = Color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    const left = new Sphere();
    left.setTransform(multiply(translation(-1.5, 0.33, -0.75),
      scaling(0.33, 0.33, 0.33)));
    left.material.color = Color(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    const world = World();
    world.objects = [floor, backWall, middle, right, left];
    world.lightSource = PointLight(point(-10, 10, -10), Color(1, 1, 1));

    const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, Math.PI / 3);
    camera.transform = viewTransform(point(0, 1.5, -5),  point(0, 1, 0), vector(0, 1, 0));

    this.state = {
      world,
      camera,
      imgBlob: null,
      ready: false,
    };
  }

  componentDidMount() {
    // let initial scene render before hogging the cpu
    setTimeout(() => {
      this.castRays();
    }, 1000);
  }

  render() {
    return this.state.ready ? (
      <div>
        <h1>File generated</h1> (<FileDownloadButton fileBlob={this.state.imgBlob} fileName={this.state.imgFileName} />)
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
        <h1>{ProjectTitle}</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project6;
