import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { MapView, Location, Permissions } from 'expo';

class MapComponent extends Component {
  state = {
    locationResult: null,
    location: {coords: {latitude: 0, longitude: 0}},
  };

  componentDidMount() {

    this.setState({ locationResult: this.props.locationResult });
    console.log("locationResult: " + JSON.stringify(this.props.locationResult, null, 2));
    this.setState({ location: this.props.locationResult });
  }

  parseLatLong(locationString) {
    let location = {};
    console.log(locationString);
    location = JSON.parse(locationString);
    this.setState({ location: location });
  }

  render() {
    return (
      <MapView
        provider={'google'}
        style={{ alignSelf: 'stretch', flex: 0.8 }}
        showsUserLocation={true}
        region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }}>
		
	    {this.state.locationResult !== null ?
	    <Marker coordinate={{this.state.location.coords.latitude, this.state.location.coords.longitude}} /> : <View>{
	    }
    	</MapView>
    );
  }
}

export default MapComponent;
