//import liraries
import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { Container, Content, Icon, Header, Left, Right, Body } from 'native-base';
import CardComponent from '../../components/CardComponent';
import { MapView, Location, Permissions } from 'expo';

// create a component
class HomeTab extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="ios-home" style={{color: tintColor}} />
    )
  }
  state = {
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    locationResult: null,
    location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location), location, });
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#e8195b'}}>
          <Left><Icon name="ios-send-outline" style={{ paddingLeft: 10 }} /></Left>
          <Body><Text>Therify</Text></Body>
          <Right><Icon name="ios-camera-outline" style={{paddingLeft: 10}} /></Right>
        </Header>

        <Content>
          <CardComponent 
          imageSource="1"
          therifies="301"/>
        </Content>


        <MapView
          provider={'google'}
          style={{ alignSelf: 'stretch', height: 200 }}
          showsUserLocation = {true}
          region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
        />
          
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
});

//make this component available to the app
export default HomeTab;
