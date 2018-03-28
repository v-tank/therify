// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet} from "react-native";
import {MapView} from "expo";
import ClusteredMapView from "react-native-maps-super-cluster";

import {type NavigationProps} from "../../components";
import {type Photo} from "../api";
import PhotoThumbnail from "./PhotoThumbnail";
import PhotoCluster from "./PhotoCluster";

const mapStyle = require("../../components/mapStyle");

const {Marker} = MapView;

type Location = { latitude: number, longitude: number };
type Cluster = {
    pointCount: number,
    clusterId: string,
    coordinate: Location
};

type PhotoMapProps = NavigationProps<*> & {
    photos: Photo[]
};

export default class PhotoMap extends React.Component<PhotoMapProps> {

    map: ClusteredMapView;

    @autobind
    setMapRef(map: ClusteredMapView | null) {
        this.map = map;
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        requestAnimationFrame(() => {
            this.map.getMapRef().animateToRegion({
                latitude: 47.377343,
                longitude: 8.535342,
                latitudeDelta: 20,
                longitudeDelta: 20
            }, 1);
        });
    }

    onPressMarker(photo: Photo) {
        const {navigation} = this.props;
        const from = photo.location ? photo.location.city : "";
        navigation.navigate("Photo", { photo, from });
    }

    onPressCluster(photos: Photo[]) {
        const {navigation} = this.props;
        navigation.navigate("Place", { photos });
    }

    @autobind
    renderMarker(dp: { location: Location, photo: Photo }): React.Node {
        const {navigation} = this.props;
        const {photo} = dp;
        return (
            <Marker coordinate={dp.location} key={photo.id} onPress={() => this.onPressMarker(photo)}>
                <PhotoThumbnail size={60} from="" {...{photo, navigation}} />
            </Marker>
        );
    }

    @autobind
    renderCluster(cluster: Cluster): React.Node {
        const {navigation} = this.props;
        const {pointCount: count, clusterId, coordinate} = cluster;
        const clusteredPoints = this.map.getClusteringEngine().getLeaves(clusterId, 100);
        const photos = clusteredPoints.map(clusterPoint => clusterPoint.properties.item.photo);
        return (
            <Marker coordinate={coordinate} onPress={() => this.onPressCluster(photos)}>
                <PhotoCluster {...{photos, navigation, count}} />
            </Marker>
        );
    }

    render(): React.Node {
        const {photos} = this.props;
        const data = photos.map(photo => ({ photo, location: photo.location && photo.location.position }));
        return (
            <ClusteredMapView
                style={styles.map}
                data={data}
                initialRegion={INIT_REGION}
                ref={this.setMapRef}
                renderMarker={this.renderMarker}
                renderCluster={this.renderCluster}
                customMapStyle={mapStyle}
                provider="google"
            />
        );
    }
}

const INIT_REGION = {
    latitude: 47.377343,
    longitude: 8.535342,
    latitudeDelta: 0.00125,
    longitudeDelta: 0.00125
};

const styles = StyleSheet.create({
    map: {
        flex: 1
    }
});
