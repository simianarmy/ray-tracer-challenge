/**
 * Project 16
 * Demonstrate use of Groups by rendering a hexagon shape
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
import { parseObjFile, parseObjFromUrl } from "./lib/obj-file";
import { Scene } from "./components/scene";
import "./App.css";

// Control resolution = render time
const ProjectTitle = "Project 16";
const HSIZE = 100;
const VSIZE = 100;
const RESOLUTION = 2;
const CANVAS_SCALE = 2;

function Project16() {

  function addParsed(parser) {
    const objectGroup = parser.toGroup();

    objectGroup.setTransform(multiply(multiply(translation(-1, 1, 8), rotationX(-degreesToRadians(120))), scaling(.8, .8, .8)));
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

  function updateObjData() {
    const input = document.querySelector("#objFileData").value;
    const parser = parseObjFile(input);
    addParsed(parser);
  }

  function onRenderTick(x, y) {
    //console.log("rendered pixel at ", x, y);
  }

  let world = World();
  const plane = new Plane();
  //plane.material.setTransformation(multiply(rotationY(0.785), scaling(2, 2, 2)));
  plane.setTransform(translation(0, -1, 0));

  world.objects = [plane];
  world.lightSource = PointLight(point(-5, 10, -18), Color(1, 1, 1));

  const camera = Camera(HSIZE * RESOLUTION, VSIZE * RESOLUTION, Math.PI/3);
  camera.transform = viewTransform(
    point(0, 4, -20),
    point(0, 1, 0),
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
        <textarea width="400" height="600" id="objFileData" style={{width: 400, height: 300}}/>
        <input type="submit" value="Update" onClick={updateObjData} />
        {loaded &&
        <Scene width="700" height="550" world={sceneWorld} camera={camera} title={ProjectTitle} canvasScale={CANVAS_SCALE} renderTickCb={onRenderTick} />
        }
      </header>
    </div>
  );
}

export default Project16;
