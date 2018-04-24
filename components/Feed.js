// import components
import React, { Component } from 'react';
import { RefreshControl, StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';
import Grid from 'react-native-grid-component';
import SocketIOClient from 'socket.io-client';

// determine the image width depending on the width of the device
const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      renderedImages: [],
      refreshing: false
    }
    
    this.onReceivedPhoto = this.onReceivedPhoto.bind(this);

    // Establishes connection with the server
    this.socket = SocketIOClient('https://therifyserver.herokuapp.com');
    this.socket.on('feedPhoto', this.onReceivedPhoto);
    
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

  // Go to the detail page when an image is pressed; passes the id of the image clicked on to render the necessary info
  onImagePress = (id) => {
    console.log(this.props.focusedPhoto)
    if(this.props.focusedPhoto == id) { //go to details page
      this.props.navigation.navigate('Detail', { id: id });
    } else { //focus on photo
      this.props.focusOnPhoto(id);
      //update UI to show photo focus
      var images = this.state.renderedImages;
      for(let i = 0; i < images.length; i++) {
        if(images[i].key == this.props.focusedPhoto) {
          images[i].style = styles.focused;
        }
      }
    }
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
  onReceivedPhoto(photo) {
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

  // function to render each image using the data received
  _renderItem = (data, i) => {
    var feedItem = (
      <TouchableWithoutFeedback 
        key={data._id} 
        onPress={() => this.onImagePress(data._id)}>
        <View style={styles.item}>
          <Image 
            source={{ uri: data.image}}
            style={styles.image}
          />

          { 
            data.verified ? 
            <View style={{ position: 'absolute', right: 5, bottom: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#5BBA47', justifyContent: 'center', alignItems: 'center'}} >
              <Text style={{ color: 'white' , backgroundColor: 'transparent'}}>✓</Text> 
            </View> :
            <View />
          }
          
        </View>
      </TouchableWithoutFeedback>
    );

    //store a reference to the rendered item so that it can be updated later
    this.setState({renderedImages: this.state.renderedImages.push(feedItem)});

    return feedItem;
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
  item: {
    flex: 1,
    height: imageWidth,
    margin: 1,
    borderWidth: 1,
    borderColor: '#cccccc'
  },
  list: {
    flex: 1,
  },
  image: {
    flex: 1,
    height: imageWidth,
  },
  focused: {
    borderColor: 'blue'
  }
});