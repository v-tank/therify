//import liraries
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

  componentDidMount() {
    imageID = this.props.navigation.state.params.id;
    imageURL = 'https://therifyserver.herokuapp.com/photos/' + imageID;
    // console.log(imageURL);
    this.fetchInfo(imageURL, imageID);

  }

  fetchInfo(imageURL, imageID) {
    fetch(imageURL).then((response) => response.json()).then((responseJson => {
      // console.log("hello");
      // console.log(Object.keys(responseJson));
      // console.log(responseJson);
      // console.log(this.state.image.photo.description);
      this.setState({ image: responseJson.photo });
      this.setState({ comments: responseJson.comments });
      this.setState({ user: responseJson.user });
      this.setState({ isLoading: false });

      // console.log(this.state.comments);
      // console.log(responseJson);
      // console.log(this.state.comments[0].body);
      // console.log(this.state["comments"].length !== 0);
      // this.state["comments"].map(comment => { 
      //   console.log(comment.body);
      // });
    })).catch(error => console.log(error));
  }

  async postComment() {
    Vibration.vibrate();
    this.textInput.clear()
    
    var userEmail = await AsyncStorage.getItem('userEmail').catch(err => {
      console.log(err);
    })

    console.log('Posting comment');
    const imageID = this.state.image._id;

    var commentBody = {
      email: userEmail,
      body: this.state.comment,
      photoID: imageID
    }

    var queryURL = 'https://therifyserver.herokuapp.com/photos/comment/add/' + imageID;
    // console.log(queryURL);
    
    fetch(queryURL, {
      method: 'POST',
      body: JSON.stringify(commentBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((responseJson => {
      //TODO: notify that upload was successful, remove the uploaded photo from the UI
      var comments = this.state["comments"];
      comments.push(responseJson);
      // console.log(this.state.image["comments"]);
      console.log("fetching");
      console.log(imageURL, imageID);
      this.fetchInfo(imageURL, imageID);
      // console.log(this.state.comments);
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
          </CardItem>

          <CardItem style={{height: 40}}>
            <Text>{this.state.image.rating} Therified</Text>
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
