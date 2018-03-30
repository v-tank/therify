CardComponent

//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base';

// create a component
class CardComponent extends Component {
  render() {

    const images = {
      "1": require('../assets/images/splash.png'),
      "2": require('../assets/images/splash.png'),
      "3": require('../assets/images/splash.png')
    }

    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail source ={require('../assets/images/icon.png')} />
            <Body>
              <Text>// User's Name Goes Here</Text>
              <Text note>// Date Goes Here</Text>
            </Body>
          </Left>
        </CardItem>

        <CardItem cardBody>
          <Image source={images[this.props.imageSource]} style={styles.mainImage}/>
        </CardItem>

        <CardItem style={{height: 45}}>
          <Left>
            <Button transparent>
              <Icon name="ios-heart-outline" style={styles.icon} />
            </Button>
            <Button transparent>
              <Icon name="ios-chatbubbles-outline" style={styles.icon} />
            </Button>
          </Left>
        </CardItem>

        <CardItem style={{height: 20}}>
          <Text>{this.props.therifies} Therified</Text>
        </CardItem>

        <CardItem>
          <Body>
            <Text>
              <Text style={styles.userName}>username </Text>
              // The image description can go here.
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainImage: {
    height: 400,
    width: null,
    flex: 1
  },
  icon: {
    color: 'black'
  },
  userName: {
    fontWeight: '900',
  }
});

//make this component available to the app
export default CardComponent;
