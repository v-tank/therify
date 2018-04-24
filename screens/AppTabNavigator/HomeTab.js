//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Header, Left, Right, Body } from 'native-base';
import MapComponent from '../../components/MapComponent';
import { TextInput, FlatList, Button, Image } from 'react-native';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";
import Searchbar from '../../components/SearchBar';
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

  // Get the location when component mounts
  componentDidMount() {
    this._getLocationAsync();
  }

  // Function to check for permissions and get the current location's lat and long
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
    

    try {
      let result = await Location.geocodeAsync(this.state.locationText);
      if(result != undefined) {
        this.setState({ inProgress: true });
        this.setState({ location: { coords: { latitude: result[0].latitude, longitude: result[0].longitude } } });
      }
    } catch (e) {
      console.log(e);
    } finally {
      //remove old pins from map
      this.setState({pinLocations: []});
      this.setState({inProgress: false});
    }
  }

  // add pins on map for each photo's location
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

  // updates the search text to be used in the Google Maps search
  updateState = (text) => {
    this.setState({ locationText: text });
    // console.log(this.state.locationText);
  }

  // Defines the icon for the tab and the styles
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" style={styles.tabBarIcon} />
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* Loads map and the feed once data has been received */}
        {
          this.state.inProgress 
            ? <Text>Loading...</Text> 
            : <MapComponent 
                locationResult={this.state.location}
                pinLocations={this.state.pinLocations} 
              />
        }

        {
          this.state.inProgress
            ? <Text></Text> 
            : <Searchbar
                updateState={this.updateState}
                updateLocation={this._attemptGeocodeAsync}
              />
        }
        
        {
          this.state.inProgress 
          ? <Text></Text> 
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
    color: '#ea2564',
    fontSize: 20
  }
});

//make this component available to the app
export default HomeTab;