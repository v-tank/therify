// @flow
import * as React from "react";
import {TabNavigator, StackNavigator} from "react-navigation";

import {StackNavigatorOptions} from "../components/Navigation";

import {MusicTabBar} from "./components";

import Library from "./Library";
import Album from "./Album";
import Discovery from "./Discovery";
import Playlist from "./Playlist";
import Profile from "./Profile";

import type {NavigationProps} from "../components/Navigation";

const tabs = [
    { key: "Library", label: "Library", icon: "music" },
    { key: "Discovery", label: "Discovery", icon: "book" },
    { key: "MusicalProfile", label: "Profile", icon: "user" }
];

const LibraryNavigator = StackNavigator({
    Library: { screen: Library },
    Album: { screen: Album }
}, StackNavigatorOptions);

const DiscoveryNavigator = StackNavigator({
    Discovery: { screen: Discovery },
    Playlist: { screen: Playlist }
}, StackNavigatorOptions);

const ProfileNavigator = StackNavigator({
    MusicalProfile: { screen: Profile },
    ProfileAlbum: { screen: Album },
    ProfilePlaylist: { screen: Playlist }
}, StackNavigatorOptions);

export const MusicNavigator = TabNavigator({
    Library: { screen: LibraryNavigator },
    Discovery: { screen: DiscoveryNavigator },
    MusicalProfile: { screen: ProfileNavigator }
}, {
    animationEnabled: false,
    // eslint-disable-next-line react/display-name
    tabBarComponent: ({ navigation }: NavigationProps<>) => <MusicTabBar {...{navigation, tabs}} />,
    tabBarPosition: "bottom",
    swipeEnabled: false
});
