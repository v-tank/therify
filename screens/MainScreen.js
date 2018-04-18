// Import components and screens
import React, { Component } from "react";
import { AsyncStorage, View, Text, StyleSheet, Platform } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { TabNavigator, StackNavigator } from "react-navigation";
import HomeTab from "./AppTabNavigator/HomeTab";
import CameraTab from "./AppTabNavigator/CameraTab";
import ProfileTab from "./AppTabNavigator/ProfileTab";
import DetailScreen from "./AppTabNavigator/DetailScreen";

// Creates a stack navigator for the Home Tab
const FeedStack = StackNavigator({
  Home: {
    screen: HomeTab,
    navigationOptions: {
      title: "Home"
    }
  },
  Detail: {
    screen: DetailScreen,
    path: "/photo/:id",
    navigationOptions: {
      title: "Detail"
    }
  }
});

const ProfileStack = StackNavigator({
  Profile: {
    screen: ProfileTab,
    navigationOptions: {
      title: "Profile"
    }
  }
});

// create a component
class MainScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  state = {
    userEmail: ""
  };

  async componentWillMount() {
    this.checkLoggedIn();
  }

  // Checks for the logged in user
  checkLoggedIn() {
    AsyncStorage.getItem("userEmail").then(userEmail => {
      this.setState({ userEmail });
    });
  }

  render() {
    return <AppTabNavigator />;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
});

//make this component available to the app
export default MainScreen;

// Creates a tab navigator with the 3 necessary tabs
const AppTabNavigator = TabNavigator(
  {
    FeedStack: {
      screen: FeedStack,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon name={"home"} size={26} style={{ color: tintColor }} />
        )
      }
    },
    CameraTab: {
      screen: CameraTab,
      path: "/camera",
      navigationOptions: {
        tabBarLabel: "Camera",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon name={"camera"} size={26} style={{ color: tintColor }} />
        )
      }
    },
    ProfileTab: {
      screen: ProfileStack,
      path: "/profile",
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon name={"user"} size={26} style={{ color: tintColor }} />
        )
      }
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        ...Platform.select({
          android: {
            backgroundColor: "white"
          }
        })
      },
      activeTintColor: "#e8195b",
      inactiveTintColor: "#d1cece",
      showLabel: false,
      showIcon: true
    }
  }
);
