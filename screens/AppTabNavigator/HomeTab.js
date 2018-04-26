//import liraries
import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, View, Text, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { Container, Content, Header, Left, Right, Body } from 'native-base';
import MapComponent from '../../components/MapComponent';
import { TextInput, FlatList, Button, Image, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";
import Searchbar from "../../components/SearchBar";
import Feed from '../../components/Feed';
import { Permissions, Location } from 'expo';

// create a component
class HomeTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationText: '',
      result: '',
      inProgress: true,
      location: '',
      pinLocations: [],
      focusedPhoto: '',
      modalVisible: false,
      username: ''
    };

    this._attemptGeocodeAsync = this._attemptGeocodeAsync.bind(this);
  }

  // Defines the icon for the tab and the styles
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="home" style={styles.tabBarIcon} />
    )
  };

  // Get the location when component mounts
  componentDidMount() {
    this._getLocationAsync();
    this.checkNewUser();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  async checkNewUser() {
    var newUser = await AsyncStorage.getItem('newUser').catch(err => {
      console.log(err);
    })
    if (newUser === "true") {
      this.setState({modalVisible: true});
    }
  }

  async submitUsername() {
    var usersEmail = await AsyncStorage.getItem('userEmail').catch(err => {
      console.log(err);
    })

    var usernameObj = { email: usersEmail, username: this.state.username };
    fetch('https://therifyserver.herokuapp.com/user/setUsername', {
      method: 'POST',
      body: JSON.stringify(usernameObj),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      // console.log(response);
      console.log("Username was set successfully!");
      AsyncStorage.setItem('username', this.state.username);
      this.setModalVisible(!this.state.modalVisible);
    }).catch(error => console.log(error));
  }

  // Function to check for permissions and get the current location's lat and long
  _getLocationAsync = async () => {
    this.setState({ inProgress: true });
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
        location
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });
    this.setState({ inProgress: false });
  };

  //gets the device's position and removes map pins from the previous location
  _attemptGeocodeAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
        location
      });
    }

    const { locationText, result } = this.state;

    try {
      let result = await Location.geocodeAsync(this.state.locationText);
      if (result != undefined) {
        this.setState({ inProgress: true });
        this.setState({
          location: {
            coords: {
              latitude: result[0].latitude,
              longitude: result[0].longitude
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      //remove old pins from map
      this.setState({ pinLocations: [] });
      this.setState({ inProgress: false });
    }
  };

  // updates the search text to be used in the Google Maps search
  updateState = text => {
    this.setState({ locationText: text });
  };

  // update state with a new map pin
  addPinLocation(photoData) {
    var locationArray = photoData.location.split(" ");
    var pinLocation = {
      coords: {
        latitude: parseFloat(locationArray[0]),
        longitude: parseFloat(locationArray[1])
      },
      id: photoData._id,
      title: photoData.title,
      description: photoData.description
    };
    var pinLocations = this.state.pinLocations;
    pinLocations.push(pinLocation);
    this.setState({ pinLocations });
  }

  // Update the currently focused photo, and go to the detail page when it is pressed again
  clickOnPhoto(id) {
    if(this.state.focusedPhoto != id) {
      this.setState({focusedPhoto: id}/*, () => {
        console.log(this.state.focusedPhoto);
      }*/);
    } else {
      
      this.props.navigation.navigate('Detail', { id: id });
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* Loads map and the feed once data has been received */}
        {
          this.state.inProgress 
            ? <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#ea2564" />
              </View>
            : <MapComponent 
                locationResult={this.state.location}
                pinLocations={this.state.pinLocations}
                focusedPhoto={this.state.focusedPhoto}
                clickOnPhoto={this.clickOnPhoto.bind(this)}
              />
        }

        {
          this.state.inProgress ? <Text></Text> :
          <Searchbar
            updateState={this.updateState}
            updateLocation={this._attemptGeocodeAsync}
          />
        }

        {this.state.inProgress ? (
          <Text />
        ) : (
          <Container>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
                <View style={{
                  marginTop: 22, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View>
                  <Text style={{fontSize: 32, textAlign: 'center', flex: 1, marginTop: 50}}>Welcome to Therify!</Text>
                  
                  <View style={{flex: 2}}>
                    <Text style={{fontSize: 26, textAlign: 'center'}}>Create a Username</Text>

                    <TextInput
                      placeholder="johnsmith"
                      style={{ height: 30, fontSize: 15, textAlign: "center", backgroundColor: "#eeeeee", borderRadius: 20, marginTop: 20 }} 
                      onChangeText={text => {
                        this.setState({ username: text });
                      }}
                    />
                    
                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.submitUsername.bind(this)}
                    >
                      <Text style={styles.text}>Set Username</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Feed
              location={this.state.location}
              navigation={this.props.navigation}
              focusedPhoto={this.state.focusedPhoto}
              addPinLocation={this.addPinLocation.bind(this)}
              clickOnPhoto={this.clickOnPhoto.bind(this)}
            />
          </Container>
        )}
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  icon: {
    fontSize: 20,
    color: 'white'
  },
  tabBarIcon: {
    color: '#ea2564',
    fontSize: 20
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderRadius: 50, borderWidth: 2, borderColor: '#ea2564',
    margin: 20
  },
  text: {
    color: '#ea2564',
    fontSize: 18,
  }
});

//make this component available to the app
export default HomeTab;