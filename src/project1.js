import React from "react";

import { Canvas } from "./components/canvas";
import { Projectile } from "./lib/projectile";
import { Environment } from "./lib/environment";
import { point, vector, add, normalize } from "./lib/tuple";
import "./App.css";

const TICK_MS = 250;

class Animation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectiles: [Projectile(point(0, 1, 0), normalize(vector(1, 4, 0)))],
      environment: Environment(vector(0, -0.1, 0), vector(-0.01, 0, 0)),
      ticksUntilGround: 0,
      hitGround: false
    };
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    //this.rAF = requestAnimationFrame(this.updateAnimationState);
    setTimeout(this.updateAnimationState, TICK_MS);
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
      //this.rAF = requestAnimationFrame(this.updateAnimationState);
      setTimeout(this.updateAnimationState, TICK_MS);
    } else {
      this.setState({ hitGround: true });
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    return (
      <div className="animation">
        Pos: {this.state.projectiles[0].position.toString()}
        <br />
        Vel: {this.state.projectiles[0].velocity.toString()}
        <br />
        Ticks until ground: {this.state.ticksUntilGround}
        <br />
        {this.state.hitGround && <h3>GROUND HIT</h3>}
      </div>
    );
  }
}
function Project1() {
  return (
    <div className="App project">
      <header className="App-header">
        <h1>Project 1</h1>
        <Animation width="1200" height="1000" />
      </header>
    </div>
  );
}

export default Project1;
