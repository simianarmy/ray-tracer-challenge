import React from "react";
import { Color } from "../lib/color";

import { ColorCanvas } from "../lib/color-canvas";

export class Canvas extends React.Component {
  state = {
    rayCanvas: null
  };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.width = props.width || 300;
    this.height = props.height || 300;
    this.fillColor = props.fillColor || Color(0, 0, 0);
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const rayCanvas = ColorCanvas.initFromHTMLCanvasContext(ctx, width, height);

    this.setState({rayCanvas});
  }

  componentDidUpdate(props) {
    // Draws a square in the middle of the canvas rotated
    // around the centre by this.props.angle
    const { rayCanvas } = this.state;
    const { objects } = this.props;

    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.fillStyle = 'rgb(255,0,0)';

    if (objects) {
      objects.forEach(o => {
        //console.log("drawing red pixel at", o.position);
        //rayCanvas.writePixel(o.position.x, o.position.y, Color(1, 0, 0));
        ctx.fillRect(Math.round(o.position.x), this.height - Math.round(o.position.y), 3, 3);
      });
    }

    //ctx.putImageData(rayCanvas.toHTML5CanvasImageData(), 0, 0);
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
