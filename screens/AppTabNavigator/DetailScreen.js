// import components
import React, { Component } from 'react';
import { AsyncStorage, View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Vibration } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base';

const imageID = '';
const imageURL = '';

// create a component
class DetailScreen extends Component {

  state = {
    image: '',
    comments: [],
    user: '',
    isLoading: true,
    comment: ''
  }

  // grabs the passed in image ID and calls a function to fetch the image data
  componentDidMount() {
    imageID = this.props.navigation.state.params.id;
    imageURL = 'https://therifyserver.herokuapp.com/photos/' + imageID;
    // console.log(imageURL);
    this.fetchInfo(imageURL, imageID);

  }

  // Function that takes in the image url and ID to make a request to the server for the image info
  fetchInfo(imageURL, imageID) {
    fetch(imageURL).then((response) => response.json()).then((responseJson => {

      this.setState({ image: responseJson.photo });
      this.setState({ comments: responseJson.comments });
      this.setState({ user: responseJson.user });
      this.setState({ isLoading: false });

    })).catch(error => console.log(error));
  }

  // Function that posts the comment on the photo using the currently logged in user's email address
  async postComment() {
    Vibration.vibrate();
    this.textInput.clear()
    
    var userEmail = await AsyncStorage.getItem('userEmail').catch(err => {
      console.log(err);
    })

    const imageID = this.state.image._id;

    // Prepares the comment object to send to the database
    var commentBody = {
      email: userEmail,
      body: this.state.comment,
      photoID: imageID
    }

    var queryURL = 'https://therifyserver.herokuapp.com/photos/comment/add/' + imageID;
    
    // Makes a POST request to the server with the object created 
    fetch(queryURL, {
      method: 'POST',
      body: JSON.stringify(commentBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((responseJson => {
      // Adds the comment to the photo once the comment has been posted
      var comments = this.state["comments"];
      comments.push(responseJson);
      this.fetchInfo(imageURL, imageID);
    })).catch(error => console.log(error));
  }

  // Renders the view with the image and associated info along with the comments. Also adds the 'Therified' stamp based on the info fetched from the database
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
                <Text style={styles.userName}>{this.state.user}</Text>
                <Text note>{this.state.image.date}</Text>
              </Body>
            </Left>
          </CardItem>

          <CardItem cardBody>
            <Image 
              source={{uri: this.state.image.image}} 
              style={styles.mainImage}
            />

            {
              this.state.image.verified ?
                <View style={{ position: 'absolute', right: 5, bottom: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#5BBA47', justifyContent: 'center', alignItems: 'center' }} >
                  <Text style={{ color: 'white', backgroundColor: 'transparent' }}>✓</Text>
                </View> :
                <View />
            }
          </CardItem>

          <CardItem>
            <Body>
              <Text>
                <Text style={styles.userName}>{this.state.image.title} </Text>
                  {this.state.image.description}
              </Text>
            </Body>
          </CardItem>

          <CardItem style={{flex: 1, flexDirection: 'row'}}>
            <TextInput
              ref={input => { this.textInput = input }}
              placeholder="Add a comment..."
              multiline={true}
              numberOfLines={4}
              style={{ height: 30, fontSize: 15, textAlign: 'center', flex: 5, backgroundColor: '#eeeeee', marginRight: 10, borderRadius: 20 }}
              onChangeText={(text) => { this.setState({comment: text}) }}
            />
            <TouchableOpacity
              onPress={this.postComment.bind(this)}
            >
              <Text style={{ color: '#e8195b' }}>Post</Text>
            </TouchableOpacity>
          </CardItem>
        </Card>

      }

      {
          (this.state["comments"].length !== 0) || this.state.refreshing ? 

          this.state["comments"].map((comment, i) => {
            return(
              <Card key={i}>
                <CardItem>
                  <Text style={styles.userName}>{comment.userName}</Text>
                </CardItem>
                <CardItem>
                  <Text>{comment.body}</Text>
                </CardItem>
              </Card>
            )
          }) :
          <Card>
            <CardItem>
              <Text>Be the first to comment!</Text>
            </CardItem>
          </Card>
      }

      </ScrollView>
    )
  }
}

// Creates the StyleSheet
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
