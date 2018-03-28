//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import { Camera,Permissions} from 'expo';

// create a component
class CameraTab extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="ios-camera" style={{ color: tintColor }} />
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
});

//make this component available to the app
export default CameraTab;
