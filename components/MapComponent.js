import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView, Location, Permissions } from 'expo';

class MapComponent extends Component {
  state = {
    // locationResult: null,
    location: {coords: {latitude: 0, longitude: 0}},
    pinLocations: this.props.pinLocations
  };

  componentDidMount() {
    // this.setState({ locationResult: this.props.locationResult });
    this.setState({ location: this.props.locationResult });
  }

  componentWillReceiveProps() {
    console.log(this.props.pinLocations.length);
    this.setState({pinLocations: this.props.pinLocations});
  }

  render() {
    return (
      <MapView
        provider={'google'}
        style={{ alignSelf: 'stretch', flex: 0.8 }}
        showsUserLocation={true}
        region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }}
      >
        {
          this.props.pinLocations.map(pinLocation => {
            <MapView.Marker 
              key={pinLocation.id}
              coordinate={pinLocation.coords} 
            /> 
          }) 
        }
    	</MapView>
    );
  }
}

export default MapComponent;
