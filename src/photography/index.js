// @flow
import {TabNavigator, StackNavigator} from "react-navigation";

import {TabNavigatorOptions, StackNavigatorOptions} from "../components/Navigation";

import Photos from "./Photos";
import Photo from "./Photo";
import Albums from "./Albums";
import Album from "./Album";
import Places from "./Places";
import Place from "./Place";
import Camera from "./Camera";

const tabs = [
    { key: "Photos", label: "Photos", icon: "home" },
    { key: "Albums", label: "Albums", icon: "camera" },
    { key: "Places", label: "Places", icon: "user" }
];

const AlbumsNavigator = StackNavigator({
    Albums: { screen: Albums },
    Album: { screen: Album }
}, StackNavigatorOptions);

const PlacesNavigator = StackNavigator({
    Places: { screen: Places },
    Place: { screen: Place }
}, StackNavigatorOptions);

const PhotosTabNavigator = TabNavigator({
    Photos: { screen: Photos },
    Albums: { screen: AlbumsNavigator },
    Places: { screen: PlacesNavigator }
}, TabNavigatorOptions(tabs));

export const PhotographyNavigator = StackNavigator({
    Photos: { screen: PhotosTabNavigator },
    Photo: { screen: Photo },
    Camera: { screen: Camera }
}, { ...StackNavigatorOptions, navigationOptions: { gesturesEnabled: false } });
