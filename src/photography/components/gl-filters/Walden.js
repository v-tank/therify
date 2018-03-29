// @flow
import * as React from "react";
import {Shaders, Node} from "gl-react";

const filters = require("./filters");

const shaders = Shaders.create({
    Walden: {
        frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D inputImageTexture;
      uniform sampler2D inputImageTexture2;
      uniform sampler2D inputImageTexture3;
      void main () {
        vec3 texel = texture2D(inputImageTexture, uv).rgb;
        texel = vec3(
                    texture2D(inputImageTexture2, vec2(texel.r, .83333)).r,
                    texture2D(inputImageTexture2, vec2(texel.g, .5)).g,
                    texture2D(inputImageTexture2, vec2(texel.b, .16666)).b);
        vec2 tc = (2.0 * uv) - 1.0;
        float d = dot(tc, tc);
        texel.r = texture2D(inputImageTexture3, vec2(d, (1.0-texel.r))).r;
        texel.g = texture2D(inputImageTexture3, vec2(d, (1.0-texel.g))).g;
        texel.b  = texture2D(inputImageTexture3, vec2(d, (1.0-texel.b))).b;
        gl_FragColor = vec4(texel, 1.0);
      }`
    }
});

export default class Walden extends React.PureComponent<{ children: React.Node, on: boolean }> {
    render(): React.Node {
        const {on, children: inputImageTexture} = this.props;
        if (!on) {
            return this.props.children;
        }
        return (
            <Node
                shader={shaders.Walden}
                uniforms={{
                    inputImageTexture,
                    inputImageTexture2: filters.waldenMap,
                    inputImageTexture3: filters.vignetteMap
                }}
            />
        );
    }
}
