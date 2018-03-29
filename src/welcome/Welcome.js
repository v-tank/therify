// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Image, StatusBar, Platform, ImageBackground, TouchableOpacity } from "react-native";

import { NavigationHelpers, Colors, StyleGuide, Images, Text, withTheme } from "../components";

import Kit from "./Kit";

import type { ThemeProps, ThemeName } from "../components/theme";
import type { NavigationProps } from "../components/Navigation";

const images = require("./images");

class Welcome extends React.Component<ThemeProps & NavigationProps<>> {

  componentWillMount() {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("white");
    }
  }

  navigate(themeName: ThemeName) {
    const { navigation, theme } = this.props;
    StatusBar.setBarStyle("light-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors[themeName].primary);
    }
    theme.switchColors(Colors[themeName]);
    NavigationHelpers.reset(navigation, themeName);
  }

  @autobind
  social() {
    this.navigate("Social");
  }

  @autobind
  photography() {
    this.navigate("Photography");
  }


  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: '1037327035065-ajdv9id43hfneomj9vn06m95nbv31399.apps.googleusercontent.com',
        iosClientId: '1037327035065-valj41h4a4qal4qn8ki45lqnthlqa23v.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      const {type} = result;

      if (type === 'success') {
        setTimeout(() => {
          this.navigate('Photography');
        }, 1000);
        
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render(): React.Node {
    return (
      <ImageBackground
        source={require('../../assets/images/bg_screen1.jpg')}
        style={{
          flex: 1,
          width: null,
          height: null,
        }}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text type="title1" style={styles.headerText}>Therify</Text>
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
    flex: 1
  },
  safeHeader: {
    ...StyleGuide.styles.shadow
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: StyleGuide.spacing.small
  },
  headerText: {
    color: StyleGuide.palette.white,
    margin: 50
  },
  logo: {
    width: 50,
    height: 50
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderRadius: 50, borderWidth: 2, borderColor: 'white'
  },
  content: {
    paddingVertical: StyleGuide.spacing.small
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  }
});

export default withTheme(Welcome);
