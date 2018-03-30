// @flow
import * as React from "react";
import {NavigationActions} from "react-navigation";
import type {NavigationNavigatorProps, NavigationScreenProp} from "react-navigation/src/TypeDefinition";

import TabBar from "./TabBar";
import type {Tabs} from "./TabBar";

export type NavigationProps<P: {} = {}> = NavigationNavigatorProps<{}, { params: P, index: number }>;
export type OptionalNavigationProps = {
    navigation?: NavigationScreenProp<*>
};

export class NavigationHelpers {
    static reset(navigation: NavigationScreenProp<*>, routeName: string, key: string | null = null) {
        const action = NavigationActions.reset({
            index: 0,
            key,
            actions: [
                NavigationActions.navigate({ routeName })
            ]
        });
        navigation.dispatch(action);
    }

    static logout(navigation: NavigationScreenProp<*>) {
        NavigationHelpers.reset(navigation, "Welcome");
    }
}

export const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white"
    }
};

export const TabNavigatorOptions = (tabs: Tabs) => ({
    animationEnabled: false,
    // eslint-disable-next-line react/display-name
    tabBarComponent: ({ navigation }: NavigationProps<>) => <TabBar {...{navigation, tabs}} />,
    tabBarPosition: "bottom",
    swipeEnabled: false
});
