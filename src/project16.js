/**
 * Project 16
 * Demonstrate rendering obj data
 *
 * Teapot (low-res)
 * https://graphics.cs.utah.edu/courses/cs6620/fall2013/prj05/teapot-low.obj
 * Flip X 90
 *
 * Dog
 * https://free3d.com/3d-model/dog-v1--722788.html
* Flip Y 90
 *
 */
import React from "react";

import {
  point,
  vector,
  multiply,
  scaling,
  World,
  Color,
  PointLight,
  translation,
  rotationX,
  rotationY,
  rotationZ,
  Camera,
  viewTransform,
  Plane,
  SolidPattern,
  degreesToRadians
} from "./lib/index";
import { parseObjFromUrl } from "./lib/obj-file";
import { Scene } from "./components/scene";
import { ObjFileInput } from "./components/objfile-input";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 16";
const HSIZE = 100;
const VSIZE = 100;
const RESOLUTION = 1;
const CANVAS_SCALE = 2;

function Project16() {

  function addParsed(parser) {
    console.log("extents", parser.getExtents());
    const objectGroup = parser.toGroup();

    objectGroup.setTransform(rotationY(-degreesToRadians(100)));
    objectGroup.shapes.forEach(s => s.material.pattern = new SolidPattern(Color.Red));

    world.objects.push(objectGroup);
    console.log("world objects updated", world);

    updateWorld(world);
    setLoaded(true);
  }

  async function updateObjUrl() {
    const url = document.querySelector("#objFileUrl").value;
    console.log("object file url", url);
    const parser = await parseObjFromUrl(url);
    addParsed(parser);
  }

  let lastY = 0;
  function onRenderTick(x, y) {
    if (y !== lastY) {
      console.log("rendered row", y);
      lastY = y;
    }
  }

  let world = World();
  const floor = new Plane();
  //plane.material.setTransformation(multiply(rotationY(0.785), scaling(2, 2, 2)));
  floor.setTransform(translation(0, -1, 0));
  const backWall = new Plane();
  backWall.setTransform(multiply(translation(0, 0, 6), rotationX(Math.PI/2)));

  world.objects = [floor, backWall];
  world.lightSource = PointLight(point(-1, 5, -6), Color(1, 1, 1));

  const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, Math.PI/3);
  camera.transform = viewTransform(
    point(0, 1, -3),
    point(0, 0, 0),
    vector(0, 1, 0)
  );

  const [loaded, setLoaded] = React.useState(false);
  const [sceneWorld, updateWorld] = React.useState(world);

  return (
    <div className="App project">
      <header className="App-header">
        <h1>{ProjectTitle}</h1>
        <div style={{display: "flex"}}>
          <input length="400" id="objFileUrl" placeholder="Object file URL" style={{width: 400}}/>
          <input type="submit" value="Update" onClick={updateObjUrl} style={{marginLeft: "16px"}}/>
        </div>
        <h3>Enter OBJ input below</h3>
        <ObjFileInput onChange={addParsed} />
        {loaded &&
        <Scene width="700" height="550" world={sceneWorld} camera={camera} title={ProjectTitle} canvasScale={CANVAS_SCALE} renderTickCb={onRenderTick} />
        }
      </header>
    </div>
  );
}

export default Project16;
