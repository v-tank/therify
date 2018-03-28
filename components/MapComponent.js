import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Constants, MapView, Location, Permissions} from 'expo';

class MapComponent extends Component {
  state = {
    locationResults:null,
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
  };
  
  componentDidMount() {
    //when the component mount get the current location from the device and center that on the maps
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    }
    let loc = await Location.getCurrentPositionAsync({}); 
    let newLocation={
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.0922, 
      longitudeDelta: 0.0421 
    }
    this.setState({mapRegion:newLocation});
  };

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  render() {
    return (
      <MapView
        style={{ alignSelf: 'stretch', height: 200 }}
        region={this.state.mapRegion}
        provider={MapView.PROVIDER_GOOGLE}
        onRegionChange={this._handleMapRegionChange}
        showUserLocation = {true}
      />
    );
  }
}

export default MapComponent;
