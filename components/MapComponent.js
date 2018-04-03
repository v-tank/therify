import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView, Location, Permissions } from 'expo';

class MapComponent extends Component {
  state = {
    locationResult: null,
    location: {coords: {latitude: 0, longitude: 0}},
  };

  componentDidMount() {
    this.setState({ locationResult: this.props.locationResult });
    this.setState({ location: this.props.locationResult });
  }

  render() {
    return (
      <MapView
        provider={'google'}
        style={{ alignSelf: 'stretch', flex: 0.8 }}
        showsUserLocation={true}
        region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.09, longitudeDelta: 0.09 }}>
		
        {this.state.locationResult !== null ?
        <MapView.Marker coordinate={this.state.location.coords} /> : <View />
        }
    	</MapView>
    );
  }
}

export default MapComponent;
