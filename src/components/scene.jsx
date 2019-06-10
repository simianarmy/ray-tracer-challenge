import React from "react";

import { FileDownloadButton } from "./file-download-button";
import { render } from "../lib/camera";

export class Scene extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      imgBlob: null,
      ready: false
    };

    this.previewCanvas = React.createRef();
    this.scaledCanvas = React.createRef();
  }

  castRays() {
    const { camera, world, title, canvasScale } = this.props;

    // synchronous render, result is fully rendered world
    const canvas = render(camera, world);

    const previewCanvas = this.previewCanvas.current;
    const scaleCanvas = this.scaledCanvas.current;
    const ppmData = canvas.saveToPPM();

    canvas.toHtmlCanvas(previewCanvas, canvasScale, scaleCanvas);

    this.setState({
      ready: true,
      imgBlob: new Blob([ppmData], { type: "text/plain;charset=utf-8" }),
      imgFileName: `${title}.ppm`
    });
  }

  componentDidMount() {
    // let initial scene render before hogging the cpu
    setTimeout(() => {
      this.castRays();
    }, 1000);
  }

  render() {
    const { camera } = this.props;
    const { ready } = this.state;

    return (
      <>
        {ready || (
          <>
            <h1>Generating...</h1>
            <canvas
              ref={this.previewCanvas}
              width={camera.hsize}
              height={camera.vsize}
              style={{ marginTop: "32px" }}
            />
          </>
        )}
        {ready && (
          <>
            <FileDownloadButton
              fileBlob={this.state.imgBlob}
              fileName={this.state.imgFileName}
            />
          </>
        )}
      <canvas ref={this.scaledCanvas} />
      </>
    );
  }
}

