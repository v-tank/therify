import React from 'react';
import { View, StyleSheet, Text, Button, ImageBackground } from 'react-native';
import Expo from 'expo';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  async signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: '1037327035065-ajdv9id43hfneomj9vn06m95nbv31399.apps.googleusercontent.com',
      iosClientId: '1037327035065-valj41h4a4qal4qn8ki45lqnthlqa23v.apps.googleusercontent.com',
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
