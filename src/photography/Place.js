// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";

import {Feed, StyleGuide, type NavigationProps} from "../components";
import {PhotoThumbnail} from "./components";
import {type Photo} from "./api";

export default class Place extends React.PureComponent<NavigationProps<{ photos: Photo[] }>> {

    @autobind
    renderItem(photo: Photo): React.Node {
        const {navigation} = this.props;
        return <PhotoThumbnail from="Photos" {...{photo, navigation}} />;
    }

    render(): React.Node {
        const {renderItem} = this;
        const {navigation} = this.props;
        const {photos} = navigation.state.params;
        const data = photos;
        const back = "Places";
        const title = photos[0].location ? photos[0].location.name : "";
        return (
            <Feed
                style={styles.content}
                numColumns={3}
                {...{back, data, renderItem, title, navigation}}
            />
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: StyleGuide.spacing.small
    }
});
