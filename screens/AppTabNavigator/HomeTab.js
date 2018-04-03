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
      inProgress: true,
      location: '',
      pinLocations: []
    }

    this._attemptGeocodeAsync = this._attemptGeocodeAsync.bind(this);
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    this.setState({ inProgress: true });
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });
    this.setState({ inProgress: false });
  };

  _attemptGeocodeAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }

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
      // console.log("result: " + JSON.stringify(result, null, 2));
      // console.log("latitude: " + JSON.stringify(result[0].latitude, null, 2));
      this.setState({ location: { coords: { latitude: result[0].latitude, longitude: result[0].longitude } } });
      // console.log(this.state.location);

      // this.setState({ locationText: '' });
      // alert(`Searched for: ${locationText}; Returned result is: ${JSON.stringify(result)}`);
    } catch (e) {
      console.log(e);
      // this.setState({ error: e.message });
    } finally {
      // console.log("finally");
      // this.setState({ inProgress: false });
    }
  }

  addPinLocation(photoData) {
    var locationArray = photoData.location.split(" ");
    var pinLocation = {
      coords: {
        latitude: parseFloat(locationArray[0]),
        longitude: parseFloat(locationArray[1]),
      },
      id: photoData._id,
      title: photoData.title,
      description: photoData.description
    };
    var pinLocations = this.state.pinLocations;
    pinLocations.push(pinLocation);
    this.setState({pinLocations});
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

        {
          this.state.inProgress 
            ? <Text>Loading</Text> 
            : <MapComponent 
                locationResult={this.state.location}
                pinLocations={this.state.pinLocations} 
              />
        }

        <SearchBar
          updateState={this.updateState}
          updateLocation={this._attemptGeocodeAsync}
        />


        {
          this.state.inProgress 
          ? <Text>Loading</Text> 
          : <Feed 
              location={this.state.location} 
              navigation={this.props.navigation}
              addPinLocation={this.addPinLocation.bind(this)} 
            />
        }


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