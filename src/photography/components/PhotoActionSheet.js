// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, Animated, Dimensions} from "react-native";
import {observer} from "mobx-react/native";
import {observable, action} from "mobx";

import {Sheet} from "../../components";

type PhotoActionSheetProps = {
    title: string,
    children: React.Node,
    onClose: () => mixed
};

@observer
export default class PhotoActionSheet extends React.Component<PhotoActionSheetProps> {

    @observable animation: Animated.Value = new Animated.Value(0);
    @observable visible = false;

    @action show() { this.visible = true; }
    @action hide() { this.visible = false; }

    @autobind
    toggle() {
        const {onClose} = this.props;
        if (!this.visible) {
            this.show();
            Animated.timing(
                this.animation,
                {
                    toValue: 1,
                    duration,
                    useNativeDriver
                }
            ).start();
        } else {
            onClose();
            Animated.timing(
                this.animation,
                {
                    toValue: 0,
                    duration,
                    useNativeDriver
                }
            ).start(() => this.hide());
        }
    }

    render(): React.Node {
        const {toggle, animation} = this;
        const {children, title} = this.props;
        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [height, 0]
        });
        return (
            <AnimatedSheet style={[styles.sheet, { transform: [{ translateY }] }]} {...{title, toggle}}>
                {children}
            </AnimatedSheet>
        );
    }
}

const {height} = Dimensions.get("window");
const AnimatedSheet = Animated.createAnimatedComponent(Sheet);
const duration = 350;
const useNativeDriver = true;
const styles = StyleSheet.create({
    sheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    }
});
