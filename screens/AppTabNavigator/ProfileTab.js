//import liraries
import React, { Component } from 'react';
import { Container, Content, Header, Left, Body, Right, Button, Thumbnail } from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Feather as Icon } from "@expo/vector-icons";
import { RefreshControl, AsyncStorage, StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';
import Grid from 'react-native-grid-component';
import SocketIOClient from 'socket.io-client';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;
var userEmail = '';

// create a component
class ProfileTab extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      images: [],
      refreshing: false
    }
    
    this.onReceivedPhoto = this.onReceivedPhoto.bind(this);

    this.socket = SocketIOClient('http://192.168.0.12:8080');
    this.socket.on('authoredPhoto', this.onReceivedPhoto);
    
    //comes after because it uses socket
    this.loadImages = this.loadImages.bind(this);

    this.loadImages();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.loadImages(); //sets refreshing back to false
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onImagePress = (id) => {
    this.props.navigation.navigate('Detail', { id: id });
  }

  async loadImages() {
    userEmail = await AsyncStorage.getItem("userEmail").catch(err => console.log(err));
    var request = {
      email: userEmail
    }
    this.socket.emit('profileRequested', request);

    if(this.mounted) {
      this.setState({refreshing: false});
    }
  }

  onReceivedPhoto(photo) {
    var photoIsNew;
    var images = this.state.images;
    photoIsNew = images.every(image => {
      return image._id != photo._id
    });
    
    if(photoIsNew) {
      images.push(photo);
      this.setState({images});

    }
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
      <Container style={{ flex: 1, backgroundColor: 'white' }}>
        <Header style={{ backgroundColor: '#e8195b', paddingTop: 30 }}>
          
          <Body><Image source={require('../../assets/images/text-logo.png')} /></Body>
          
        </Header>

        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Thumbnail source={require('../../assets/images/icon.png')} style={styles.profileImage} />
            </View>
            <View style={{ flex: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text>24</Text>
                  <Text style={{ fontSize: 10, color: 'grey' }}>posts</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text>101</Text>
                  <Text style={{ fontSize: 10, color: 'grey' }}>followers</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text>14</Text>
                  <Text style={{ fontSize: 10, color: 'grey' }}>following</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{userEmail}</Text>
          </View>
        </View>


        <Grid
          style={styles.list}
          renderItem={this._renderItem}
          data={this.state.images}
          itemsPerRow={3}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />

      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5
  },
  icon: {
    fontSize: 20,
    color: 'white'
  },
  tabBarIcon: {
    color: '#e8195b',
    fontSize: 20
  },
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

//make this component available to the app
export default ProfileTab;