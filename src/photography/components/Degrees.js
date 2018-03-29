// @flow
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import {Animated, Dimensions} from "react-native";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";

import {Text} from "../../components";

type DegreesProps = {
    rotation: Animated.Value
};

@observer
export default class Degrees extends React.Component<DegreesProps> {

    @observable degrees: number;

    @autobind @action
    setDegrees(value: { value: number }) {
        this.degrees = _.round(((value.value / viewport) * 50) - 25);
    }

    componentWillMount() {
        this.props.rotation.addListener(this.setDegrees);
    }

    render(): React.Node {
        return (
            <Text align="center" primary>{`${this.degrees}°`}</Text>
        );
    }
}

const viewport = Dimensions.get("window").width;
