// Import components
import React, { Component } from 'react';
import { AsyncStorage, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Expo from 'expo';

// create a component
export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  // Function to use Google OAuth
  async signInWithGoogleAsync() {
    try {
      // Object that uses the client IDs created for each platform
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidClientId: '1037327035065-ajdv9id43hfneomj9vn06m95nbv31399.apps.googleusercontent.com',
        iosClientId: '1037327035065-valj41h4a4qal4qn8ki45lqnthlqa23v.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        // If the user logs in successfully, make a server request with their email
        var serverRequest = { email: result.user.email };

        // Make a POST request to the database to create a new user if the email is not found in the database
        fetch('https://therifyserver.herokuapp.com/user/login', {
          method: 'POST',
          body: JSON.stringify(serverRequest),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          var stringified = JSON.stringify(response);
          var parsed = JSON.parse(stringified);
          parsed = parsed["_bodyText"];
          parsed = JSON.parse(parsed);
          
          if (parsed.newUser) {
            parsed = parsed["newUser"];
            // console.log("New user: " + parsed);
            AsyncStorage.setItem('newUser', 'true');
          }
          else {
            AsyncStorage.setItem('newUser', 'false');
          }

          // set global logged-in variable
          AsyncStorage.setItem('userEmail', serverRequest.email);

          // navigate to the main page
          this.props.navigation.navigate('Main');

        }).catch(error => console.log(error));
      } else {
        return { cancelled: true };
      }

    //ONLY FOR DEVELOPMENT, SO APP CAN BE ACCESSED WITHOUT SERVER RESPONSE
    // this.props.navigation.navigate('Main');
     
    } catch (e) {
      return { error: true };
    }
}

  // Render the background image and login button at start
  render() {
    return (
      <ImageBackground
        source={require('../assets/images/bg_screen1.png')}
        style={styles.backgroundImage}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.emptyContainer} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={this.signInWithGoogleAsync.bind(this)}
              style={styles.button}
            >
              <Text style={styles.text}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

// Creates the StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  backgroundImage: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderRadius: 50, borderWidth: 2, borderColor: 'white'
  },
  buttonContainer: {
    flex: 1
  },
  emptyContainer: {
    flex: 1.25
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  }
});
