//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Permissions, Location } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";

// create a component
class SearchBar extends Component {

  handleTextInputChange = (text) => {
    // console.log(text)
    this.props.updateState(text);
  }

  handleSubmit = () => {
    this.props.updateLocation();
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', margin: 20, justifyContent: 'space-around', alignItems: 'center' }}>
        <TextInput
          ref="search"
          placeholder="Search"
          style={{ height: 40, fontSize: 20, textAlign: 'center', flex: 5, backgroundColor: '#eeeeee', marginRight: 10 }}
          onChangeText={(text) => { this.handleTextInputChange(text) }}
        />

        <Icon name="search"
          onPress={this.handleSubmit}
          style={{ flex: 1, fontSize: 30, backgroundColor: '#e8195b', color: 'white', paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}
        />
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
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default SearchBar;