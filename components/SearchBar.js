// import components
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Permissions, Location } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";
import { SearchBar} from 'react-native-elements'

// create a component
class Searchbar extends Component {

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
      <View style={{flexDirection: 'column', alignItems: 'stretch' }}>
        
        <SearchBar
          noIcon
          ref="search"
          placeholder="Search"
          style={{ alignSelf: 'stretch', fontSize: 50, textAlign: 'center'}}
          onChangeText={(text) => { this.handleTextInputChange(text) }}
        />

        <Icon name="search"
          onPress={this.handleSubmit}
          style={{ fontSize: 30, backgroundColor: '#ea2564', textAlign: 'center', color: 'white', paddingTop: 5, paddingBottom: 5 }}
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
export default Searchbar;