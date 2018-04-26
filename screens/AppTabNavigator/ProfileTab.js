//import liraries
import React, { Component } from 'react';
import { Container, Content, Header, Left, Body, Right, Button, Thumbnail } from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Feather as Icon } from "@expo/vector-icons";
import { ActivityIndicator, RefreshControl, AsyncStorage, StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text, FlatList } from 'react-native';
import Grid from 'react-native-grid-component';
import SocketIOClient from 'socket.io-client';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;
var userEmail = '';
var username = '';

// create a component
class ProfileTab extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      images: [],
      refreshing: false,
      username: '',
      animating: false,
      noPhotosHere: false
    }
    
    this.onReceivedPhoto = this.onReceivedPhoto.bind(this);
    this.stopLoading = this.stopLoading.bind(this);

    this.socket = SocketIOClient('https://therifyserver.herokuapp.com');
    this.socket.on('authoredPhoto', this.onReceivedPhoto);
    this.socket.on('noPhotosFound', this.stopLoading);

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
    this.setState({ animating: true });
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

    username = await AsyncStorage.getItem("username").catch(err => console.log(err));
    this.setState({username});
  }

  //when the server says there are no photos for the user, stop the loading animation
  stopLoading() {
    this.setState({ animating: false });
    this.setState({ noPhotosHere: true });
  }

  onReceivedPhoto(photo) {
    this.setState({ animating: false });
    this.setState({ noPhotosHere: false });
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
    const animating = this.state.animating;
    const noPhotosHere = this.state.noPhotosHere;
    return (
    <Container style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 10, alignItems: "center", backgroundColor: 'rgba(0, 0, 0, 0.7)', marginBottom: 10 }}>
        <View>
          <Thumbnail source={require("../../assets/images/icon.png")} style={styles.profileImage} />
        </View>

        <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: "bold", color: 'white' }}>
            {this.state.username}
          </Text>
        </View>
      </View>
      
      <View style={styles.bottomView}>
      { animating ?
        <ActivityIndicator
          animating={animating}
          color='#bc2b78'
          size="large"
          style={styles.activityIndicator} />

        : 
        
        (noPhotosHere) ?

          <FlatList
            data={[{key: 'Nothing to show here.'}]}
            refreshControl={
              // adds pull-down-to-refresh functionality
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            renderItem={({item}) => <Text style={styles.noPhotosText}>{item.key}</Text>}
          >
          </FlatList>

          :

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
      }
      </View>
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
    backgroundColor: 'red',
  },
  image: {
    flex: 1,
    height: imageWidth,
  },
  noPhotosText: {
    color: '#999',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50
  },
  bottomView: {
    flex: 1,
    justifyContent: 'center'
  }
});

//make this component available to the app
export default ProfileTab;
