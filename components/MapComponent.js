// Import components
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView, Location, Permissions, Text } from 'expo';

class MapComponent extends Component {
  state = {
    location: {coords: {latitude: 0, longitude: 0}},
    pinLocations: this.props.pinLocations
  };

  // set the state to get the lat and long for the searched location
  componentDidMount() {
    this.setState({ location: this.props.locationResult });
  }

  // update the pin locations based on the location searched
  componentWillReceiveProps() {
    this.setState({pinLocations: this.props.pinLocations});
  }

  // renders the markers for the photo locations
  renderMapMarkers() {
    if(this.state.pinLocations.length === 0) {
      return (<View/>);
    } else {
      var pinArray = [];
      for(let i = 0; i < this.state.pinLocations.length; i++) {
        var pinLocation = this.state.pinLocations[i];
        pinArray.push((
          // marker takes in the coordinates, title, and description for each one on the map
          <MapView.Marker
            key={pinLocation.id}
            coordinate={pinLocation.coords}
            title={pinLocation.title}
            description={pinLocation.description} 
          /> 
        ));
      }
      return pinArray;
    }
  }

  // renders a Google maps component and zooms in on the current location at a defined zoom level; also renders the map markers
  render() {
    return (
      <MapView
        provider={'google'}
        style={{ alignSelf: 'stretch', flex: 0.8 }}
        showsUserLocation={true}
        region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }}
      >
        {this.renderMapMarkers()}
    	</MapView>
    );
  }
}

export default MapComponent; // Export the component to be used in the Home Tab
