// import components
import React, { Component } from 'react';
import { RefreshControl, StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';
import PhotoThumbnail from './PhotoThumbnail.js';
import Grid from 'react-native-grid-component';
import SocketIOClient from 'socket.io-client';


export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      focusedPhoto: this.props.focusedPhoto,
      refreshing: false
    }
    
    this.onReceivedThumbnail = this.onReceivedThumbnail.bind(this);
    this.onReceivedLarge = this.onReceivedLarge.bind(this);

    // Establishes connection with the server
    this.socket = SocketIOClient('https://therifyserver.herokuapp.com');
    this.socket.on('thumbnailData', this.onReceivedThumbnail);
    this.socket.on('largeData', this.onReceivedLarge);

    // Comes after because it uses socket
    this.loadImages = this.loadImages.bind(this);

    this.loadImages();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.loadImages(); // sets refreshing back to false
  }

  componentDidMount() {
    this.mounted = true;
  }

  // this is here to enforce not updating state when the component is not mounted
  componentWillUnmount() {
    this.mounted = false;
  }

  // load images within a 500 meter radius of device
  loadImages() {
    var lat = '';
    var long = '';
    if(this.props.location != '') {
      lat = this.props.location.coords.latitude;
      long = this.props.location.coords.longitude;
    }

    //store the id's of the images the client already has, so that the server
    //knows to not send them again
    var alreadyLoaded = this.state.images.map(image => {
      return image._id;
    });

    var request = {
      location: `${lat} ${long}`,
      range: 500,
      alreadyLoaded: alreadyLoaded 
    }
    this.socket.emit('feedRequested', request);

    if(this.mounted) {
      this.setState({refreshing: false});
    }
  }

  // waits for received photos and adds pins based on the locations received
  onReceivedThumbnail(photo) {
    var photoIsNew;
    var images = this.state.images;
    photoIsNew = images.every(image => {
      return image._id != photo._id
    });
    
    if(photoIsNew) {
      images.push(photo);
      this.setState({images});

      //give HomeTab access to the photo's location
      this.props.addPinLocation(photo);
    }
  }

  //download full photo in background
  onReceivedLarge(photo) {
    var images = this.state.images;
    images.forEach(image => {
      if(image._id == photo._id) {
        image.image = photo.image;
      }
    })
  }

  // componentWillUpdate() {
  //   console.log(this.state.focusedPhoto);
  // }

  componentWillReceiveProps(nextProps) {
     this.setState({focusedPhoto: nextProps.focusedPhoto}, function() {
       // console.log(this.state.focusedPhoto);
     });
   }

  // function to render each image using the data received
  _renderItem = (data, i) => {
    return (
      <PhotoThumbnail
        key={data._id}
        data={data}
        clickOnPhoto={this.props.clickOnPhoto}
        highlighted={(this.state.focusedPhoto === data._id) ? true : false}
      />
    );
  }

  // renders the grid with the pictures
  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.images}
        itemsPerRow={3}
        refreshControl={
          // adds pull-down-to-refresh functionality
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    );
  }
}

// Stylesheet
const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});