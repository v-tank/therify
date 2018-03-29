// @flow
import * as React from "react";
import {Surface} from "gl-react-expo";

import {type StyleProps} from "../../components";

import {Temperature, ContrastSaturationBrightness, Sepia, Walden, Brannan, Valencia} from "./gl-filters";
import GLImage from "./GLImage";

export type FilterName = "saturate" | "sepia" | "warm" | "walden" | "brannan" | "valencia";
type FilterProps = StyleProps & {
    uri: string,
    aspectRatio: number,
    name: FilterName,
    onDraw?: () => mixed
};

export default class Filter extends React.PureComponent<FilterProps> {

    render(): React.Node {
        const {style, uri, aspectRatio, name, onDraw} = this.props;
        const source = { uri };
        return (
            // $FlowFixMe
            <Surface {...{style}}>
                <ContrastSaturationBrightness on={name === "saturate"} contrast={1} saturation={0} brightness={1}>
                    <Temperature on={name === "warm"}>
                        <Sepia on={name === "sepia"} sepia={1.2}>
                            <Walden on={name === "walden"}>
                                <Brannan on={name === "brannan"}>
                                    <Valencia on={name === "valencia"}>
                                        <GLImage {...{source, aspectRatio, onDraw}} />
                                    </Valencia>
                                </Brannan>
                            </Walden>
                        </Sepia>
                    </Temperature>
                </ContrastSaturationBrightness>
            </Surface>
        );
    }
}
