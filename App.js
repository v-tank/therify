// Imports the necessary components for the app to run
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

// Defines the stack navigator that renders all the pages
const AppStackNavigator = StackNavigator({
  Login: {
    screen: LoginScreen
  },
  Main: {
    screen: MainScreen
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
