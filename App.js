import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';

export default class App extends React.Component {
  render() {
    return (
      <AppStackNavigator/>
    );
  }

}

const MainNavigator = StackNavigator({
    Welcome: { screen: Welcome },
    Social: { screen: SocialNavigator },
    Photography: { screen: PhotographyNavigator },
}, StackNavigatorOptions);
