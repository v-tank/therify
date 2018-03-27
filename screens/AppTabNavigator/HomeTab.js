//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Icon, Header, Left, Right, Body } from 'native-base';
import CardComponent from '../../components/CardComponent';
import { MapView } from 'expo';
import { TextInput, FlatList, Button } from 'react-native';

// create a component
class HomeTab extends Component {

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="ios-home" style={{color: tintColor}} />
    )
  }

  state = {
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
  };

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#e8195b'}}>
          <Left><Icon name="ios-send-outline" style={{ paddingLeft: 10 }} /></Left>
          <Body><Text>Therify</Text></Body>
          <Right><Icon name="ios-camera-outline" style={{paddingLeft: 10}} /></Right>
        </Header>
        <TextInput placeholder="Search"/>
        <Button title="Search"/>
        <MapView
          style={{ alignSelf: 'stretch', height: 200 }}
          region={this.state.mapRegion}
          provider={'google'}
          onRegionChange={this._handleMapRegionChange}
        />
        <Text>Location</Text>
        <FlatList
          contentContainerStyle={styles.list}
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
        {/*
        <Content>
          <CardComponent 
          imageSource="1"
          therifies="301"/>
        
        </Content>
        */}
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
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

//make this component available to the app
export default HomeTab;
