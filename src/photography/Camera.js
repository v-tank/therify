// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, ActivityIndicator, SafeAreaView, TouchableOpacity, Dimensions} from "react-native";
import {Camera, Permissions} from "expo";
import {observable, action} from "mobx";
import {observer} from "mobx-react/native";

import {
    IconButton, Icon, StyleGuide, notImplementedYet, withTheme, type ThemeProps, type NavigationProps
} from "../components";

import {EnableCameraPermission} from "./components";

type PermissionStatus = 'undetermined' | 'granted' | 'denied';
type CameraProps = NavigationProps<> & ThemeProps;

@observer
class CameraScreen extends React.Component<CameraProps> {

    @observable hasCameraPermission: null | boolean = null;
    @observable type: number = Camera.Constants.Type.back;
    @observable flashMode: number = Camera.Constants.FlashMode.off;
    @observable showGrid = false;

    @action
    setCameraPermission(status: PermissionStatus) {
        this.hasCameraPermission = status === "granted";
    }

    @autobind @action
    toggleFlash() {
        const {flashMode} = this;
        const {on, off} = Camera.Constants.FlashMode;
        this.flashMode = flashMode === on ? off : on;
    }

    @autobind @action
    toggleGrid() {
        this.showGrid = !this.showGrid;
    }

    @autobind @action
    toggleCamera() {
        const {type} = this;
        const {front, back} = Camera.Constants.Type;
        this.type = type === back ? front : back;
    }

    @autobind
    goBack() {
        this.props.navigation.goBack();
    }

    async componentWillMount(): Promise<void> {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setCameraPermission(status);
    }

    render(): React.Node {
        const {hasCameraPermission, type, flashMode, toggleFlash, toggleCamera, goBack, toggleGrid, showGrid} = this;
        const {theme} = this.props;
        if (hasCameraPermission === null) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator />
                </View>
            );
        } else if (hasCameraPermission === false) {
            return <EnableCameraPermission />;
        }
        return (
            <Camera style={styles.camera} {...{type, flashMode}}>
                <SafeAreaView style={styles.cameraSafeArea}>
                    <View style={styles.header}>
                        <IconButton name="grid" onPress={toggleGrid} />
                        <IconButton
                            name={flashMode === Camera.Constants.FlashMode.on ? "zap" : "slash"}
                            onPress={toggleFlash}
                        />
                    </View>
                    {
                        showGrid && (
                            <View style={styles.grid}>
                                <View style={styles.row}>
                                    <View style={styles.cell} />
                                    <View style={styles.cell} />
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.cell} />
                                    <View style={styles.cell} />
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.cell} />
                                    <View style={styles.cell} />
                                </View>
                            </View>
                        )
                    }
                    <View style={styles.footer}>
                        <IconButton name="x" onPress={goBack} />
                        <TouchableOpacity onPress={notImplementedYet}>
                            <View style={styles.snapButton}>
                                <View style={[styles.innerSnapButton, { backgroundColor: theme.palette.primary }]}>
                                    <Icon color="white" name="camera" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <IconButton name="rotate-ccw" onPress={toggleCamera} />
                    </View>
                </SafeAreaView>
            </Camera>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    camera: {
        flex: 1
    },
    cameraSafeArea: {
        flex: 1,
        justifyContent: "space-between"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: StyleGuide.spacing.small
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: StyleGuide.spacing.small
    },
    snapButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: StyleGuide.palette.white,
        justifyContent: "center",
        alignItems: "center"
    },
    innerSnapButton: {
        width: 52,
        height: 52,
        borderRadius: 25.5,
        justifyContent: "center",
        alignItems: "center"
    },
    grid: {
        borderColor: StyleGuide.palette.darkGray,
        borderWidth: 1,
        borderBottomWidth: 0,
        marginLeft: StyleGuide.spacing.small,
        width: width - (StyleGuide.spacing.small * 2),
        height: width - (StyleGuide.spacing.small * 2)
    },
    row: {
        height: (width - (StyleGuide.spacing.small * 2)) / 3,
        borderColor: StyleGuide.palette.darkGray,
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    cell: {
        width: (width - (StyleGuide.spacing.small * 2)) / 3,
        height: (width - (StyleGuide.spacing.small * 2)) / 3,
        borderColor: StyleGuide.palette.darkGray,
        borderRightWidth: 1
    }
});

export default withTheme(CameraScreen);
