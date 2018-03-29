// @flow
import * as React from "react";
import { Node, Shaders } from "gl-react";

const shaders = Shaders.create({
    ContrastSaturationBrightness: {
        frag: `precision highp float;
varying vec2 uv;
uniform sampler2D t;

uniform float contrast;
uniform float saturation;
uniform float brightness;

const vec3 L = vec3(0.2125, 0.7154, 0.0721);

void main () {
    vec4 c = texture2D(t, uv);
    vec3 brt = c.rgb * brightness;
    gl_FragColor = vec4(mix(
        vec3(0.5),
        mix(vec3(dot(brt, L)), brt, saturation),
        contrast), c.a);
}`
    }
});

type ContrastSaturationBrightnessProps = {
    children: React.Node,
    contrast: number,
    saturation: number,
    brightness: number,
    on: boolean
};

export default class ContrastSaturationBrightness extends React.PureComponent<ContrastSaturationBrightnessProps> {

    static defaultProps = {
        contrast: 1,
        saturation: 1,
        brightness: 1
    };

    render(): React.Node {
        const {on, children: t, contrast, saturation, brightness} = this.props;
        if (!on) {
            return this.props.children;
        }
        return (
            <Node
                shader={shaders.ContrastSaturationBrightness}
                uniforms={{ t, contrast, saturation, brightness }}
            />
        );
    }
}
