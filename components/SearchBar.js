// import components
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Permissions, Location } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";

// create a component
class SearchBar extends Component {

  // updates the state as the user types in the location
  handleTextInputChange = (text) => {
    this.props.updateState(text);
  }

  // calls the updateLocation function passed in as a prop
  handleSubmit = () => {
    this.props.updateLocation();
  }

  // Renders the search bar's text input and search icon
  render() {
    return (
      <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-around', alignItems: 'center' }}>
        <TextInput
          ref="search"
          placeholder="Search"
          style={{ height: 30, fontSize: 15, textAlign: 'center', flex: 5, backgroundColor: '#eeeeee', marginRight: 10 }}
          onChangeText={(text) => { this.handleTextInputChange(text) }}
        />

        <Icon name="search"
          onPress={this.handleSubmit}
          style={{ flex: 1, fontSize: 20, backgroundColor: '#e8195b', color: 'white', paddingLeft: 30, paddingTop: 5, paddingBottom: 5 }}
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