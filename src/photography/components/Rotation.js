// @flow
import * as React from "react";
import {StyleSheet, View, ScrollView, Animated, Dimensions} from "react-native";

import {LinearGradient} from "expo";

import {StyleGuide, withTheme, type ThemeProps} from "../../components";

import Degrees from "./Degrees";

type RotationProps = ThemeProps & {
    rotation: Animated.Value
};

class Rotation extends React.Component<RotationProps> {


    render(): React.Node {
        const {theme, rotation} = this.props;
        return (
            <View style={styles.root}>
                <Degrees {...{rotation}} />
                <View style={styles.scroll}>
                    <LinearGradient
                        style={{ ...StyleSheet.absoluteFillObject }}
                        colors={["white", theme.palette.primary, "white"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <ScrollView
                        ref={setScrollView}
                        contentContainerStyle={styles.content}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={1}
                        onScroll={Animated.event([{
                            nativeEvent: {
                                contentOffset: {
                                    x: rotation
                                }
                            }
                        }])}
                        bounces={false}
                        horizontal
                    >
                        {
                            repeat(ticks + 2).map(tick => <View style={styles.tick} key={tick} />)
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const repeat = (length: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < length; i += 1) {
        numbers.push(i);
    }
    return numbers;
};

const viewport = Dimensions.get("window").width;
const width = viewport * 2;
const ticks = 50;
const tickThickness = 2;
const padding = (width - (ticks * tickThickness)) / (ticks + 1);
const setScrollView = (scrollView: ?ScrollView) => {
    if (scrollView) {
        scrollView.scrollTo({ x: viewport / 2, y: 0, animated: false });
    }
};
const styles = StyleSheet.create({
    root: {
        marginVertical: StyleGuide.spacing.small
    },
    scroll: {
        marginTop: StyleGuide.spacing.tiny
    },
    content: {
        width
    },
    tick: {
        width: padding,
        backgroundColor: StyleGuide.palette.white,
        marginHorizontal: 1,
        height: 60
    }
});

export default withTheme(Rotation);
