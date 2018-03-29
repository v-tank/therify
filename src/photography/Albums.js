// @flow
import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";

import {Feed, Text, Icon, StyleGuide, type NavigationProps} from "../components";

import PhotoAPI, {type Photo} from "./api";
import {PhotoThumbnail} from "./components";

export default class Albums extends React.PureComponent<NavigationProps<>> {

    goToAlbum(album: string) {
        const {navigation} = this.props;
        navigation.navigate("Album", { album });
    }

    @autobind
    renderItem(group: { id: string, photos: Photo[] }): React.Node {
        const {navigation} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={() => this.goToAlbum(group.id)}>
                    <View style={styles.headline}>
                        <View>
                            <Text type="headline">{group.id}</Text>
                            <Text type="footnote">
                                {`${group.photos.length} photo${group.photos.length > 1 ? "s" : ""}`}
                            </Text>
                        </View>
                        <Icon name="chevron-right" />
                    </View>
                </TouchableOpacity>
                <View style={styles.thumbnail}>
                    {
                        group.photos.slice(0, 3).map(photo => (
                            <PhotoThumbnail key={photo.id} from={photo.album} {...{photo, navigation}} />
                        ))
                    }
                </View>
            </View>
        );
    }

    render(): React.Node {
        const {renderItem} = this;
        const {navigation} = this.props;
        const data = _.values(PhotoAPI.albums).map(photos => ({ id: photos[0].album, photos }));
        const rightAction = {
            icon: "camera",
            onPress: () => navigation.navigate("Camera")
        };
        return (
            <Feed title="Albums" />
        );
    }
}

const styles = StyleSheet.create({
    headline: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: StyleGuide.palette.white,
        padding: StyleGuide.spacing.small
    },
    thumbnail: {
        flexDirection: "row",
        marginVertical: StyleGuide.spacing.small
    }
});
