//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Header, Left, Right, Body } from 'native-base';
import CardComponent from '../../components/CardComponent';
import MapComponent from '../../components/MapComponent';
import { AsyncStorage, TextInput, FlatList, Button, Image } from 'react-native';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";
import SearchBar from '../../components/SearchBar';
import Feed from '../../components/Feed';

import { Permissions, Location } from 'expo';
// create a component
class HomeTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      locationText: '',
      result: '',
      inProgress: false,
    }

    this._attemptGeocodeAsync = this._attemptGeocodeAsync.bind(this);
  }

  _attemptGeocodeAsync = async () => {
    const { locationText, result } = this.state;
    // alert(`Searching for ${locationText}`);
    // console.log(`updating location; searching for ${locationText}`);
    this.setState({ inProgress: true });

    try {
      // console.log("trying");
      // console.log(typeof(this.state.locationText));
      // let result = await Location.geocodeAsync("Golden Gate");

      let result = await Location.geocodeAsync(this.state.locationText);
      // console.log("type of" +typeof(result));
      // alert(`${JSON.stringify(result)}`);
      this.setState({ result });
      // this.setState({ locationText: '' });
      alert(`Searched for: ${locationText}; Returned result is: ${JSON.stringify(result)}`);
    } catch (e) {
      console.log(e);
      // this.setState({ error: e.message });
    } finally {
      // console.log("finally");
      this.setState({ inProgress: false });
    }
  }

  updateState = (text) => {
    this.setState({ locationText: text });
    // console.log(this.state.locationText);

  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" style={styles.tabBarIcon} />
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: '#e8195b', paddingTop: 30 }}>
          <Left><Icon name="paper-plane" style={styles.icon} /></Left>
          <Body><Image source={require('../../assets/images/text-logo.png')} /></Body>
          <Right><Icon name="camera" style={styles.icon} /></Right>
        </Header>

        <MapComponent />

        <SearchBar
          updateState={this.updateState}
          updateLocation={this._attemptGeocodeAsync}
        />

        <Feed />

      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  icon: {
    fontSize: 20,
    color: 'white'
  },
  tabBarIcon: {
    color: '#e8195b',
    fontSize: 20
  }
});

//make this component available to the app
export default HomeTab;
