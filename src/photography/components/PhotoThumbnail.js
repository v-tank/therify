// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, Dimensions, View, TouchableWithoutFeedback} from "react-native";

import {Image, StyleGuide, type NavigationProps} from "../../components";
import {type Photo} from "../api";

type PhotoProps = NavigationProps<*> & {
    photo: Photo,
    from: string,
    size: number
};

const {width} = Dimensions.get("window");
const defaultSize = (width - (4 * StyleGuide.spacing.small)) / 3;

export default class PhotoThumbnail extends React.PureComponent<PhotoProps> {

    static defaultProps = {
        size: defaultSize
    };

    @autobind
    onPress() {
        const {navigation, photo, from} = this.props;
        navigation.navigate("Photo", { photo, from });
    }

    render(): React.Node {
        const {onPress} = this;
        const {photo, size} = this.props;
        return (
            <TouchableWithoutFeedback {...{onPress}}>
                <View>
                    <Image
                        style={[styles.photo, { width: size, height: size }]}
                        uri={photo.urls.small}
                        preview={photo.urls.preview}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    photo: {
        borderWidth: 3,
        borderColor: StyleGuide.palette.white,
        borderRadius: 2,
        marginLeft: StyleGuide.spacing.small,
        ...StyleGuide.styles.shadow
    }
});
