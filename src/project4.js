import React from "react";

import { Canvas } from "./components/canvas";
import { point } from "./lib/tuple";
import { multiplyTuple } from "./lib/matrix";
import { rotationZ, scaling, translation } from "./lib/transformations";
import { degreesToRadians } from "./lib/math";
import "./App.css";

class Animation extends React.Component {
  saveCanvas = imgData => {
    this.setState({ imgData, shouldSave: false });
  };

  constructor(props) {
    super(props);

    let hours = [];
    const rad = Math.PI * 2 / 12;
    let lastp = point(50, 100, 0);
    const rotation = rotationZ(rad);
    const scale = scaling(2.2, 2.2, 0);
    const translate = translation(340, 280, 0);

    for (let i = 0; i < 12; i++) {
      // rotate hours around z by 360 / 12 degrees
      const p = multiplyTuple(rotation, lastp);
      lastp = p;

      hours.push({
        position: multiplyTuple(translate, multiplyTuple(scale, p))
      });
    }
    let minX = Math.min(...hours.map(h => h.position.x));
    let minY = Math.min(...hours.map(h => h.position.y));

    // normalize points
    /*
    hours = hours.map(h => {
      return {
        position: {
          x: h.position.x + -minX,
          y: h.position.y + -minY
        }
      };
    });
    */

    this.state = {
      hourPoints: hours,
      canvas: null,
      imgData: null,
      shouldSave: false
    };
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
    //setTimeout(this.updateAnimationState, TICK_MS);
  }

  updateAnimationState() {
    let { hourPoints } = this.state;

    //this.setState({});

    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    const { shouldSave } = this.state;

    return (
      <div className="animation">
        <Canvas
          {...this.props}
          objects={this.state.hourPoints}
          onSave={shouldSave ? this.saveCanvas : null}
        />
        <br />
        <button onClick={() => this.setState({ shouldSave: true })}>
          Generate PPM
        </button>
        <br />
        {this.state.imgData && (
          <div className="ppmdata">
            <textarea rows="20" cols="60" value={this.state.imgData} />
          </div>
        )}
      </div>
    );
  }
}

function Project4() {
  return (
    <div className="App project">
      <header className="App-header">
        <h1>Project 4</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project4;
