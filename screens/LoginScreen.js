//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Expo from 'expo';

// create a component
export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidClientId: '1037327035065-ajdv9id43hfneomj9vn06m95nbv31399.apps.googleusercontent.com',
        iosClientId: '1037327035065-valj41h4a4qal4qn8ki45lqnthlqa23v.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        this.props.navigation.navigate('Main');
        console.log(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/images/bg_screen1.jpg')}
        style={{
          flex: 1,
          width: null,
          height: null,
        }}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Therify</Text>
          <TouchableOpacity
            onPress={this.signInWithGoogleAsync.bind(this)}
            style={styles.button}
          >
            <Text style={styles.text}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderRadius: 50, borderWidth: 2, borderColor: 'white'
  },
  title: {
    color: '#ffffff',
    fontSize: 72,
    margin: 50,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  }
});
