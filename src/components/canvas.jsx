import React from "react";
import { Color } from "../lib/color";

export class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.width = props.width || 300;
    this.height = props.height || 300;
    this.fillColor = props.fillColor || Color(0, 0, 0);
  }

  componentDidUpdate() {
    // Draws a square in the middle of the canvas rotated
    // around the centre by this.props.angle
    const { angle } = this.props;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0, width, height);
    //ctx.translate(width / 2, height / 2);
    //ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = `rgb(${this.fillColor.red}, ${this.fillColor.green}, ${
      this.fillColor.blue
    })`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  render() {
    return (
      <canvas
        data-testid="canvas"
        width={this.width}
        height={this.height}
        ref={this.canvasRef}
      />
    );
  }
}
