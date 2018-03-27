import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Constants, Components } from 'expo';

class MapComponent extends Component {
	state = {
		mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
  	};

  	_handleMapRegionChange = mapRegion => {
    	this.setState({ mapRegion });
  	};

  	render() {
    	return (
        	<Components.MapView
				// style={{ alignSelf: 'stretch', height: 350 }}
				region={this.state.mapRegion}
				provider={Components.MapView.PROVIDER_GOOGLE}
				onRegionChange={this._handleMapRegionChange}
        	/>
    	);
  	}
}

export default MapComponent;