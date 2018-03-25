import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  Input, ImageBackground } from 'react-native';

import { Expo, Font } from 'expo';
import Styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/bg_screen1.jpg');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'georgia': require('../assets/fonts/Georgia.ttf'),
      'regular': require('../assets/fonts/Montserrat-Regular.ttf'),
      'light': require('../assets/fonts/Montserrat-Light.ttf'),
      'bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  async signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: '184726345923-qv2gj4frmeqei7sh33hdavbukljl7pnr.apps.googleusercontent.com',
      iosClientId: '184726345923-u59gpfub56aubet443knjnd4gnevn8uv.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
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
      <View style={styles.container}>
        <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        >
          {this.state.fontLoaded ?
            <View style={styles.loginView}>
              <View style={styles.loginTitle}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.travelText}>Therify</Text>
                </View>
              </View>
              <View style={styles.loginInput}>
                
              </View>
              <View style={styles.loginButton}>
                <Button
                  title='SIGN IN WITH GOOGLE'
                  activeOpacity={1}
                  underlayColor="transparent"
                  onPress={this.signInWithGoogleAsync.bind(this)}
                  loadingProps={{ size: 'small', color: 'white' }}
                  buttonStyle={{ height: 50, width: 250, backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', borderRadius: 30 }}
                  containerStyle={{ marginVertical: 10 }}
                  titleStyle={{ fontWeight: 'bold', color: '#FFFFFF' }}
                />
              </View>
              <View style={styles.footerView}>
                <Text style={{ color: 'grey' }}>
                  New here?
              </Text>
                <Button
                  title="Create an Account"
                  clear
                  activeOpacity={0.5}
                  titleStyle={{ color: 'white', fontSize: 15 }}
                  containerStyle={{ marginTop: -10 }}
                  onPress={() => console.log('Account created')}
                />
              </View>
            </View> :
            <Text>Loading...</Text>
          }
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginView: {
    marginTop: 150,
    backgroundColor: 'transparent',
    width: 250,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginTitle: {
    flex: 1,
  },
  travelText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'bold'
  },
  plusText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'regular'
  },
  loginInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    flex: 1,
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
