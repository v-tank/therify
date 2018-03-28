// @flow
import * as React from "react";

import {NavigationBar, Container, type NavigationProps} from "../components";

import PhotoAPI from "./api";
import {PhotoMap} from "./components";

export default class Places extends React.PureComponent<NavigationProps<>> {

    render(): React.Node {
        const {navigation} = this.props;
        const photos = PhotoAPI.photos.filter(photo => photo.location);
        const rightAction = {
            icon: "camera",
            onPress: () => navigation.navigate("Camera")
        };
        return (
            <Container>
                <NavigationBar title="Profile" expanded {...{rightAction, navigation}} />
                <Container>
                    {/* <PhotoMap {...{navigation, photos}} /> */}
                </Container>
            </Container>
        );
    }
}
