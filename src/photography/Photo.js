// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {
    StyleSheet, View, Image as RNImage, Platform, StatusBar, Dimensions, ActivityIndicator, Animated
} from "react-native";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";

import {NavigationBar, Image, BlurView, IconButton, Footer, type NavigationProps} from "../components";

import {Filters, Filter, PhotoActionSheet, Rotation, Crop, type FilterName} from "./components";
import type {Photo} from "./api";

type PhotoScreenProps = NavigationProps<{ photo: Photo, from: string }>;

@observer
export default class PhotoScreen extends React.Component<PhotoScreenProps> {

    filters: PhotoActionSheet;
    crop: PhotoActionSheet;

    @observable aspectRatio: number = 1;
    @observable filter: FilterName;
    @observable areFiltersReady: boolean = false;
    @observable filterAnimation = new Animated.Value(0);
    @observable rotation = new Animated.Value(width / 2);

    @autobind @action
    setFiltersAsReady() {
        this.areFiltersReady = true;
    }

    @autobind
    setFiltersRef(filters: ?PhotoActionSheet) {
        if (filters) {
            this.filters = filters;
        }
    }

    @autobind
    setCropRef(crop: ?PhotoActionSheet) {
        if (crop) {
            this.crop = crop;
        }
    }

    @autobind
    toggleFilters() {
        Animated.timing(
            this.filterAnimation,
            {
                toValue: 1,
                duration,
                useNativeDriver
            }
        ).start();
        this.filters.toggle();
    }

    @autobind
    toggleCrop() {
        Animated.timing(
            this.filterAnimation,
            {
                toValue: 1,
                duration,
                useNativeDriver
            }
        ).start();
        this.crop.toggle();
    }

    @autobind
    onCloseActionSheet() {
        Animated.timing(
            this.filterAnimation,
            {
                toValue: 0,
                duration,
                useNativeDriver
            }
        ).start();
    }

    @autobind @action
    switchFilter(filter: FilterName) {
        this.filter = filter;
    }

    @autobind @action
    setAspectRatio(width: number, height: number) {
        this.aspectRatio = width / height;
    }

    componentWillMount() {
        const {photo} = this.props.navigation.state.params;
        if (Platform.OS === "android") {
            StatusBar.setHidden(true);
        }
        // Fix getSize is already invoked somewhere in gl-react-expo
        RNImage.getSize(photo.urls.preview, this.setAspectRatio, () => this.setAspectRatio(1, 1));
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            StatusBar.setHidden(false);
        }
    }

    render(): React.Node {
        const {
            aspectRatio, toggleFilters, toggleCrop, switchFilter, areFiltersReady, setFiltersAsReady, filter: name,
            onCloseActionSheet, rotation
        } = this;
        const {navigation} = this.props;
        const {photo, from} = navigation.state.params;
        const date = moment(photo.created_at).format("DD MMMM YYYY · HH:mm");
        const title = photo.location ? photo.location.name : "";
        const subtitle = date;
        const opacity = this.filterAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const intensity = this.filterAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
        });
        const rotate = this.rotation.interpolate({
            inputRange: [0, viewport],
            outputRange: ["-25deg", "25deg"]
        });
        return (
            <View style={styles.container}>
                <Image preview={photo.urls.preview} uri={photo.urls.regular} style={styles.image} />
                <BlurView style={StyleSheet.absoluteFill} {...{intensity}} />
                {
                    <Animated.View style={{ opacity, ...StyleSheet.absoluteFillObject, transform: [{ rotate }] }}>
                        <Crop style={styles.filter}>
                            <Filter
                                style={StyleSheet.absoluteFill}
                                uri={photo.urls.regular}
                                onDraw={setFiltersAsReady}
                                {...{aspectRatio, name}}
                            />
                        </Crop>
                    </Animated.View>
                }
                {
                    !areFiltersReady && <View />
                }
                {
                    areFiltersReady && (
                        <NavigationBar type="transparent" back={from} withGradient {...{navigation, title, subtitle}} />
                    )
                }
                {
                    <Footer>
                        {
                            areFiltersReady && <IconButton name="sliders" onPress={toggleFilters} />
                        }
                        {
                            areFiltersReady && <IconButton name="crop" onPress={toggleCrop} />
                        }
                        {
                            !areFiltersReady && <ActivityIndicator color="white" />
                        }
                    </Footer>
                }
                <PhotoActionSheet ref={this.setFiltersRef} title="Filters" onClose={onCloseActionSheet}>
                    <Filters {...{photo, aspectRatio, switchFilter}} />
                </PhotoActionSheet>
                <PhotoActionSheet ref={this.setCropRef} title="Edit" onClose={onCloseActionSheet}>
                    <Rotation {...{rotation}} />
                </PhotoActionSheet>
            </View>
        );
    }
}

const duration = 300;
const useNativeDriver = true;
const {width: viewport} = Dimensions.get("window");
const width = viewport + 88;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    image: {
        ...StyleSheet.absoluteFillObject
    },
    filter: {
        position: "absolute",
        top: 50,
        left: (viewport - (width * 0.63)) / 2,
        width: width * 0.63,
        height: width * 0.63 * 1.65
    }
});
