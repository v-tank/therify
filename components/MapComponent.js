import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView, Location, Permissions, Text } from 'expo';

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
    this.setState({pinLocations: this.props.pinLocations});
  }

  renderMapMarkers() {
    if(this.state.pinLocations.length === 0) {
      return (<View/>);
    } else {
      console.log("rendering pins");
      var pinArray = [];
      for(let i = 0; i < this.state.pinLocations.length; i++) {
        var pinLocation = this.state.pinLocations[i];
        pinArray.push((
          <MapView.Marker
            key={pinLocation.id}
            coordinate={pinLocation.coords}
            title={pinLocation.title}
            description={pinLocation.description} 
          /> 
        ));
      }
      return pinArray;
        // this.state.pinLocations.map(pinLocation => {
        //   {console.log(pinLocation)}
        //   return(
        //     <MapView.Marker
        //       key={pinLocation.id}
        //       coordinate={pinLocation.coords}
        //       title={pinLocation.title}
        //       description={pinLocation.description} 
        //     /> 
        //   );
        // })
    }
  }

  render() {
    // var pinLocations = this.state.pinLocations || [];
    // console.log(pinLocations[pinLocations.length - 1]);
    return (
      <MapView
        provider={'google'}
        style={{ alignSelf: 'stretch', flex: 0.8 }}
        showsUserLocation={true}
        region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }}
      >
        {/*
        <MapView.Marker
          coordinate={
            pinLocations[0]
            ? pinLocations[0].coords
            : {latitude: 31.240747, longitude: 120.167554}
          }
        />
        */}
        {
          this.renderMapMarkers()
         // pinLocations.length === 0
          //   ? <View/>
          //   : pinLocations.map(pinLocation => {
          //       <MapView.Marker
          //         key={pinLocation.id}
          //         coordinate={pinLocation.coords}
          //         title={pinLocation.title}
          //         description={pinLocation.description} 
          //       ></MapView.Marker>
                
          //     }) 
        }
    	</MapView>
    );
  }
}

export default MapComponent;
