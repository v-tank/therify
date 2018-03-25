import React from 'react';
import { View, StyleSheet, Text, Button, ImageBackground } from 'react-native';
import Expo from 'expo';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  async signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: '184726345923-qv2gj4frmeqei7sh33hdavbukljl7pnr.apps.googleusercontent.com',
      iosClientId: '184726345923-u59gpfub56aubet443knjnd4gnevn8uv.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
      this.props.navigation.navigate('Main');
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
          <Button
            onPress={ this.signInWithGoogleAsync.bind(this)}
            title="Sign in with Google" 
          />
        </View>

      </ImageBackground >
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
  }
});
