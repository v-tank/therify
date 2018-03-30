// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";

import {Feed, StyleGuide, NavigationHelpers, Container, type NavigationProps} from "../components";

import PhotograhyAPI, {type Photo} from "./api";
import {PhotoThumbnail} from "./components";

export default class Photos extends React.Component<NavigationProps<>> {

    @autobind
    renderItem(photo: Photo): React.Node {
        const {navigation} = this.props;
        return <PhotoThumbnail from="Photos" {...{photo, navigation}} />;
    }

    @autobind
    async onPress(): Promise<void> {
        const {navigation} = this.props;
        NavigationHelpers.logout(navigation);
    }

    render(): React.Node {
        const {renderItem, onPress} = this;
        const {navigation} = this.props;
        const data = PhotograhyAPI.photos;
        const title = "Home";
        const rightAction = {
            icon: "log-out",
            onPress
        };
        return (
            // Search bar can go here
            // Map component can go here
          <Container>
            <Feed 
                style={styles.content}
                numColumns={3}
                {...{data, renderItem, title, navigation, rightAction}}
                
            />
          </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: StyleGuide.spacing.small
    }
});
