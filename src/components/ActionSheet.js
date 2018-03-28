// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Modal, TouchableOpacity, Animated, Dimensions, Platform} from "react-native";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";
import {BlurView} from "expo";

import {StyleGuide} from "./theme";
import Sheet from "./Sheet";

type ActionSheetProps = {
    title: string,
    subtitle?: string,
    children: React.Node,
    noSafeArea: boolean,
    rightAction?: {
        label: string,
        onPress: () => void
    }
};

@observer
export default class ActionSheet extends React.Component<ActionSheetProps> {

    static defaultProps = {
        noSafeArea: false
    };

    @observable animation: Animated.Value = new Animated.Value(0);
    @observable visible = false;

    @action show() { this.visible = true; }
    @action hide() { this.visible = false; }

    @autobind toggle() {
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
        const {toggle} = this;
        const {title, subtitle, rightAction, children, noSafeArea} = this.props;
        const opacity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5]
        });
        const intensity = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
        });
        const translateY = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [height, 0]
        });
        return (
            <Modal visible={this.visible} transparent onRequestClose={this.toggle}>
                <View style={styles.modal}>
                    {
                        Platform.OS === "android" && (
                            <Animated.View
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    backgroundColor: StyleGuide.palette.black,
                                    opacity
                                }}
                            >
                                <TouchableOpacity style={styles.exit} onPress={this.toggle} />
                            </Animated.View>
                        )
                    }
                    {
                        Platform.OS === "ios" && (
                            <AnimatedBlurView tint="dark" style={StyleSheet.absoluteFill} {...{intensity}}>
                                <TouchableOpacity style={styles.exit} onPress={this.toggle} />
                            </AnimatedBlurView>
                        )
                    }
                    <AnimatedSheet
                        style={{ transform: [{ translateY }] }}
                        {...{toggle, title, subtitle, rightAction, noSafeArea}}
                    >
                        {children}
                    </AnimatedSheet>
                </View>
            </Modal>
        );
    }
}

const {height} = Dimensions.get("window");
const duration = 350;
const useNativeDriver = true;
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedSheet = Animated.createAnimatedComponent(Sheet);
const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "flex-end"
    },
    exit: {
        flex: 1
    }
});
