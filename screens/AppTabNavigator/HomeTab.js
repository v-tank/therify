//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Header, Left, Right, Body } from 'native-base';
import CardComponent from '../../components/CardComponent';
import MapComponent from '../../components/MapComponent';
import { TextInput, FlatList, Button } from 'react-native';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";
import SearchBar from '../../components/SearchBar';
import Feed from '../../components/Feed';

// create a component
class HomeTab extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" style={styles.icon} />
    )
  }
  searchPressed() {
    console.log("button pressed");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: '#e8195b', marginTop: 24 }}>
          <Left><Icon name="paper-plane" style={styles.icon} /></Left>
          <Body><Text>Therify</Text></Body>
          <Right><Icon name="camera" style={styles.icon} /></Right>
        </Header>

        <MapComponent />
        
        <SearchBar />

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
    //flexWrap: 'wrap'
  },
  icon: {
    fontSize: 20,

  }
});

//make this component available to the app
export default HomeTab;