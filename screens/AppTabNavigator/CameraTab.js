//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from "@expo/vector-icons";

// create a component
class CameraTab extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="camera" style={styles.icon} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>CameraTab</Text>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    fontSize: 20
  }
});

//make this component available to the app
export default CameraTab;
