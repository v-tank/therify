// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {Image, Text, StyleGuide} from "../../components";
import {type Photo} from "../api";

type PhotoClusterProps = {
    photos: Photo[],
    count: number
};

export default class PhotoCluster extends React.PureComponent<PhotoClusterProps> {

    render(): React.Node {
        const {photos, count} = this.props;
        return (
            <View style={styles.container}>
                {
                    photos[2] && (
                        <Image
                            key={photos[2].id}
                            uri={photos[2].urls.small}
                            preview={photos[2].urls.preview}
                            style={[styles.image, styles.rotationC]}
                        />
                    )
                }
                <Image
                    key={photos[1].id}
                    uri={photos[1].urls.small}
                    preview={photos[1].urls.preview}
                    style={[styles.image, styles.rotationB]}
                />
                <Image
                    key={photos[0].id}
                    uri={photos[0].urls.small}
                    preview={photos[0].urls.preview}
                    style={[styles.image, styles.rotationA]}
                />
                <View style={styles.count}>
                    <Text type="caption" primary>{`${count}`}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 90,
        height: 90
    },
    image: {
        position: "absolute",
        top: 10,
        left: 5,
        height: 60,
        width: 60,
        borderWidth: 3,
        borderColor: StyleGuide.palette.white,
        borderRadius: 2,
        marginLeft: StyleGuide.spacing.small,
        ...StyleGuide.styles.shadow
    },
    rotationA: {
        transform: [{ rotate: "-2deg" }]
    },
    rotationB: {
        transform: [{ rotate: "6deg" }]
    },
    rotationC: {
        transform: [{ rotate: "-16deg" }]
    },
    count: {
        backgroundColor: StyleGuide.palette.white,
        width: 40,
        height: 18,
        borderRadius: 9,
        ...StyleGuide.styles.shadow,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 30,
        bottom: 25
    }
});
