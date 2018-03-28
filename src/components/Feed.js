// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {FlatList, StyleSheet, View, Animated} from "react-native";
import {observable} from "mobx";
import {observer} from "mobx-react/native";
import {LinearGradient} from "expo";

import NavigationBar from "./NavigationBar";
import Text from "./Text";
import {withTheme, StyleGuide, type StyleProps, type ThemeProps} from "./theme";
import type {NavigationProps} from "./Navigation";
import type {Action} from "./Model";

type Item = {
    id: string
};

type FeedProps<T> = ThemeProps & StyleProps & NavigationProps<*> & {
    data: T[],
    renderItem: T => React.Node,
    title: string,
    header?: React.Node,
    back?: string,
    rightAction?: Action,
    numColumns?: number
};

const keyExtractor = <T: Item>(item: T): string => item.id;

@observer
class Feed<T: Item> extends React.Component<FeedProps<T>> {

    @observable scrollAnimation = new Animated.Value(0);

    @autobind
    renderItem(item: { item: T }): React.Node {
        const {renderItem} = this.props;
        return renderItem(item.item);
    }

    render(): React.Node {
        const {renderItem, scrollAnimation} = this;
        const {data, title, navigation, theme, back, rightAction, header, numColumns, style} = this.props;
        const translateY = scrollAnimation.interpolate({
            inputRange: [55, 56, 57],
            outputRange: [55, 0, 0]
        });
        const onScroll = Animated.event(
            [{
                nativeEvent: {
                    contentOffset: {
                        y: scrollAnimation
                    }
                }
            }],
            { useNativeDriver: true }
        );
        const titleStyle = back ? {} : { transform: [{ translateY }] };
        const top = theme.palette.primary;
        const bottom = theme.palette.lightGray;
        return (
            <LinearGradient
                style={styles.root}
                locations={[0, 0.5, 0.5, 1]}
                colors={back ? [bottom, bottom, bottom, bottom] : [top, top, bottom, bottom]}
            >
                <NavigationBar
                    {...{ navigation, title, back, titleStyle, rightAction}}
                />
                <AnimatedFlatList
                    contentContainerStyle={[styles.container, style]}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={(
                        !back && (
                            <Animated.View style={{ backgroundColor: theme.palette.primary }}>
                                <View style={styles.header}>
                                    <Text type="title1" style={styles.headerText}>{title}</Text>
                                </View>
                                <View style={styles.extraHeader}>{header}</View>
                            </Animated.View>
                        )
                    )}
                    scrollEventThrottle={1}
                    columnWrapperStyle={(numColumns && numColumns > 0) ? styles.columnWrapperStyle : undefined}
                    {...{data, keyExtractor, renderItem, onScroll, numColumns}}
                />
            </LinearGradient>
        );
    }
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flexGrow: 1,
        paddingBottom: StyleGuide.spacing.small,
        backgroundColor: StyleGuide.palette.lightGray
    },
    header: {
        padding: StyleGuide.spacing.small
    },
    headerText: {
        color: StyleGuide.palette.white
    },
    extraHeader: {
        backgroundColor: StyleGuide.palette.white,
        ...StyleGuide.styles.shadow
    },
    columnWrapperStyle: {
        marginRight: StyleGuide.spacing.small,
        marginTop: StyleGuide.spacing.small
    }
});

export default withTheme(Feed);
