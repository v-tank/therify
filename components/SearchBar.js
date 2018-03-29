//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

// create a component
class SearchBar extends Component {

  state = {
    locationText: '', 
  };

  searchPressed = () => {
    const {locationText} = this.state;
    alert(`Searching for ${locationText}`);
  }

  render() {
    return (
      <View>
        <TextInput
          ref="search"
          placeholder="Search"
          style={{ height: 40, fontSize: 20, textAlign: 'center' }}
          onChangeText={locationText => this.setState({ locationText })}
        />

        <Button title="Search" onPress={this.searchPressed} />
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