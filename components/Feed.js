import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';
import Grid from 'react-native-grid-component';
import SocketIOClient from 'socket.io-client';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    }

    // this.determineUser = this.determineUser.bind(this);
    // this.onReceivedMessage = this.onReceivedMessage.bind(this);
    // this.onSend = this.onSend.bind(this);
    // this._storeMessages = this._storeMessages.bind(this);
    this.onReceivedPhoto = this.onReceivedPhoto.bind(this);

    this.socket = SocketIOClient('http://10.0.1.59:8080');
    this.socket.on('feedPhoto', this.onReceivedPhoto);
    
    //comes after because it uses socket
    this.loadImages = this.loadImages.bind(this);

    this.loadImages();
  }

  componentDidMount() {
    // this.loadImages();
  }

  //this is here to enforce not updating state when the component is not mounted
  componentWillUnmount() {
    this.mounted = false;
  }

  onImagePress = (id) => {
    // alert(id);
    this.props.navigation.navigate('Detail', { id: id });
  }

  loadImages() {
    this.mounted = true;

    var lat = '';
    var long = '';
    if(this.props.location != '') {
      lat = this.props.location.coords.latitude;
      long = this.props.location.coords.longitude;
    }
    var request = {
      location: `${lat} ${long}`,
      range: 50000
    }
    console.log("request");
    this.socket.emit('feedRequested', request);
  }

  onReceivedPhoto(photo) {
    var images = this.state.images;
    images.push(photo);
    this.setState({images});

    //give HomeTab access to the photo's location
    this.props.addPinLocation(photo);
  }

  _renderItem = (data, i) => (

    <TouchableWithoutFeedback key={data._id} onPress={() => this.onImagePress(data._id)}>
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

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.images}
        itemsPerRow={3}
      />
    );
  }
}

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
  }
});