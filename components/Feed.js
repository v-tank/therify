// import components
import React, { Component } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';
import PhotoThumbnail from './PhotoThumbnail.js';
import Grid from 'react-native-grid-component';
import SocketIOClient from 'socket.io-client';


export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      focusedPhoto: this.props.focusedPhoto,
      refreshing: false,
      animating: false,
    }
    
    this.onReceivedPhoto = this.onReceivedPhoto.bind(this);
    this.stopLoading = this.stopLoading.bind(this);

    // Establishes connection with the server
    this.socket = SocketIOClient('https://therifyserver.herokuapp.com');
    this.socket.on('feedPhoto', this.onReceivedPhoto);
    this.socket.on('noPhotosFound', this.stopLoading);

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
    this.setState({ animating: true });
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

  //when the server says there are no photos for the user, stop the loading animation
  stopLoading() {
    this.setState({ animating: false });
  }

  // waits for received photos and adds pins based on the locations received
  onReceivedPhoto(photo) {
    this.setState({ animating: false })
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
    const animating = this.state.animating;
    return (
      <View style={styles.list}>
        { animating ? 
          <ActivityIndicator
            animating={animating}
            color='#ea2564'
            size="large"
            style={styles.activityIndicator} />
            
          : 

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
        }
      </View>
    );
  }
}

// Stylesheet
const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
});