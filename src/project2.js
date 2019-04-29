import React from "react";

import { Canvas } from "./components/canvas";
import { Projectile } from "./lib/projectile";
import { Environment } from "./lib/environment";
import { point, vector, add, normalize, multiply} from "./lib/tuple";
import "./App.css";

const TICK_MS = 250;

class Animation extends React.Component {
  saveCanvas = imgData => {
    this.setState({imgData, shouldSave: false});
  }

  constructor(props) {
    super(props);

    this.state = {
      projectiles: [Projectile(point(0, 1, 0), multiply(normalize(vector(2.8, 6.1, 0)), 10.4))],
      environment: Environment(vector(0, -0.1, 0), vector(-0.01, 0, 0)),
      canvas: null,
      ticksUntilGround: 0,
      hitGround: false,
      shouldSave: false,
      imgData: null,
    };
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
    //setTimeout(this.updateAnimationState, TICK_MS);
  }

  updateProjectile(p, env) {
    const newPos = add(p.position, p.velocity);
    const newVel = add(add(p.velocity, env.gravity), env.wind);
    return Projectile(newPos, newVel);
  }

  updateAnimationState() {
    let { projectiles, environment } = this.state;

    let new_projectiles = projectiles.map(p =>
      this.updateProjectile(p, environment)
    );

    this.setState({
      projectiles: new_projectiles,
      ticksUntilGround: this.state.ticksUntilGround + 1
    });

    if (new_projectiles[0].position.y > 0) {
      //setTimeout(this.updateAnimationState, TICK_MS);
      this.rAF = requestAnimationFrame(this.updateAnimationState);
    } else {
      if (!this.state.hitGround) {
        this.setState({ shouldSave: true, hitGround: true });
        this.rAF = requestAnimationFrame(this.updateAnimationState);
      } else {
        this.setState({ hitGround: true });
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    const { shouldSave } = this.state;

    return (
      <div className="animation">
        <Canvas {...this.props} objects={this.state.projectiles} onSave={shouldSave ? this.saveCanvas : null}/>
        Ticks until ground: {this.state.ticksUntilGround}
        <br />
        {this.state.hitGround && (
          <>
          <h3>GROUND HIT</h3>
          {this.state.imgData && (
              <div className="ppmdata">
              <textarea rows="20" cols="60" value={this.state.imgData}></textarea>
              </div>
          )}
          </>
        )}
      </div>
    );
  }
}
function Project1() {
  return (
    <div className="App project">
      <header className="App-header">
        <h1>Project 2</h1>
        <Animation width="700" height="550" />
      </header>
    </div>
  );
}

export default Project1;
