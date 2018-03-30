// @flow
import {TabNavigator, StackNavigator} from "react-navigation";

import {TabNavigatorOptions, StackNavigatorOptions} from "../components/Navigation";

import Story from "./Story";
import Timeline from "./Timeline";
import Messages from "./Messages";
import Message from "./Message";
import Profile from "./Profile";

const tabs = [
    { key: "Timeline", label: "Timeline", icon: "home" },
    { key: "Messages", label: "Messages", icon: "mail" },
    { key: "Profile", label: "Profile", icon: "user" }
];

const SocialTabNavigator = TabNavigator({
    Timeline: { screen: Timeline },
    Messages: { screen: Messages },
    Profile: { screen: Profile }
}, TabNavigatorOptions(tabs));

export const SocialNavigator = StackNavigator({
    Home: { screen: SocialTabNavigator },
    Story: { screen: Story },
    Message: { screen: Message }
}, StackNavigatorOptions);
