import React from "react";
import { saveAs } from 'file-saver';

import {  point, vector, World, Sphere, Color, PointLight, scaling, translation, rotationX, rotationY, viewTransform, Camera, render  } from "./lib/index";
import { multiply } from "./lib/matrix";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 8";
const HSIZE = 100;
const VSIZE= 50;

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

  downloadImage() {
    saveAs(this.state.imgBlob, this.state.imgFileName);
  }

  constructor(props) {
    super(props);

    const floor = Sphere();
    floor.setTransform(scaling(10, 0.01, 10));
    floor.material.color = Color(1, 0.9, 0.9);
    floor.material.specular = 0;

    const leftWall = Sphere();
    leftWall.setTransform(
      multiply(
        multiply(
          multiply(
            translation(0, 0, 5),
            rotationY(-Math.PI / 4)
          ),
          rotationX(Math.PI / 2)
        ),
        scaling(10, 0.01, 10)
      )
    );
    leftWall.material = floor.material;

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

    const middle = Sphere();
    middle.setTransform(translation(-0.5, 1, 0.5));
    middle.material.color = Color(.1, 1, .5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    const right = Sphere();
    right.setTransform(multiply(translation(1.5, .5, -0.5),
      scaling(0.5, 0.5, 0.5)));
    right.material.color = Color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    const left = Sphere();
    left.setTransform(multiply(translation(-1.5, 0.33, -0.75),
      scaling(0.33, 0.33, 0.33)));
    left.material.color = Color(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    const world = World();
    world.objects = [floor, leftWall, rightWall, middle, right, left];
    world.lightSource = PointLight(point(-10, 10, -10), Color(1, 1, 1));

    const camera = Camera(HSIZE, VSIZE, Math.PI / 3);
    camera.transform = viewTransform(point(0, 1.5, -5),  point(0, 1, 0), vector(0, 1, 0));

    this.state = {
      world,
      camera,
      imgBlob: null,
      ready: false,
    };

    this.downloadImage = this.downloadImage.bind(this);
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
        <h1>File generated</h1> (<button className="dl-link" onClick={this.downloadImage}>Download {this.state.imgFileName}</button>)
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
        <h1>Project 8</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project6;
