import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
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

          <Text style={{flex: 1}}>Therify</Text>
          <TouchableOpacity
            onPress={ this.signInWithGoogleAsync.bind(this)}
            style={styles.button}
          >
            <Text style={styles.text}>Sign in with Google</Text>
          </TouchableOpacity>
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
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#dd4b39',
    padding: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 18 
  }
});
