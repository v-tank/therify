// @flow
import * as React from "react";
import {Shaders, Node} from "gl-react";

const shaders = Shaders.create({
    Sepia: {
        frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;
      uniform mat4 sepia;

      void main () {
        gl_FragColor = sepia * texture2D(t, uv);
      }`
    }
});

// eslint-disable-next-line no-mixed-operators
const mixArrays = (arr1: number[], arr2: number[], m: number) => arr1.map((v, i) => (1 - m) * v + m * arr2[i]);

type SepiaProps = {
    sepia: number,
    children: React.Node,
    on: boolean
};

export default class Sepia extends React.PureComponent<SepiaProps> {

    render(): React.Node {
        const { on, children: t, sepia: s } = this.props;
        const sepia = mixArrays([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ], [
            0.3, 0.3, 0.3, 0,
            0.6, 0.6, 0.6, 0,
            0.1, 0.1, 0.1, 0,
            0.2, 0, -0.2, 1
        ], s);
        if (!on) {
            return this.props.children;
        }
        return <Node shader={shaders.Sepia} uniforms={{ t, sepia }} />;
    }
}
