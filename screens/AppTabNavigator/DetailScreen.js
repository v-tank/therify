//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base';

// create a component
class DetailScreen extends Component {

  state = {
    imageWithComments: '',
    isLoading: true
  }

  componentDidMount() {
    const imageID = this.props.navigation.state.params.id;
    const imageURL = 'http://10.142.182.94:8080/photos/' + imageID;
    // console.log(imageURL);

    fetch(imageURL).then((response) => response.json()).then((responseJson => {
      // console.log("hello");
      // console.log(Object.keys(responseJson));
      // console.log(this.state.imageWithComments.photo.description);
      this.setState({ imageWithComments: responseJson });
      this.setState({isLoading: false})
      // console.log(this.state.imageWithComments);
    })).catch(error => console.log(error));
    
  }

  render() {
    return (
      <ScrollView>
      {
        this.state.isLoading ? <Text>Loading</Text> : 
        
        <Card>
        <CardItem>
          <Left>
            <Thumbnail source ={require('../../assets/images/icon.png')} />
            <Body>
              <Text style={styles.userName}>{this.state.imageWithComments.user}</Text>
              <Text note>{this.state.imageWithComments.photo.date}</Text>
            </Body>
          </Left>
        </CardItem>

        <CardItem cardBody>
          <Image 
            source={{uri: this.state.imageWithComments.photo.image}} 
            style={styles.mainImage}
          />
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
              <Text>{this.state.imageWithComments.photo.title} </Text>
                {this.state.imageWithComments.photo.description}
            </Text>
          </Body>
        </CardItem>
      </Card>

      }

      </ScrollView>
    )
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
export default DetailScreen;
