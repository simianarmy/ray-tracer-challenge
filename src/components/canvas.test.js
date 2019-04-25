import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import { Canvas } from "./canvas";
import { CanvasUtils } from "../lib/canvas-utils";

afterEach(cleanup);

describe("canvas", () => {
  it("sets dimensions based on props", () => {
    const { getByTestId, container } = render(
      <Canvas width="10" height="20" />
    );
    const canvas = container.getElementsByTagName("canvas")[0];
    expect(canvas.width).toEqual(10);
    expect(canvas.height).toEqual(20);
  });

  it("creating sets every pixel to color(0, 0, 0)", () => {
    const { getByTestId, container } = render(<Canvas />);
    const canvas = container.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData();
    expect(imageData.data.every(i => i === 0)).toBeTruthy();
  });
});
