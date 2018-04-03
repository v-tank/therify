//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base';

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
    const imageID = this.props.navigation.state.params.id;
    const imageURL = 'http://10.142.85.95:8080/photos/' + imageID;
    // console.log(imageURL);

    fetch(imageURL).then((response) => response.json()).then((responseJson => {
      // console.log("hello");
      // console.log(Object.keys(responseJson));
      // console.log(this.state.image.photo.description);
      this.setState({ image: responseJson.photo });
      this.setState({ comments: responseJson.comments });
      this.setState({ user: responseJson.user });
      this.setState({isLoading: false})
      // console.log(this.state.comments[0].body);
      // console.log(this.state["comments"].length !== 0);
      // this.state["comments"].map(comment => { 
      //   console.log(comment.body);
      // });
    })).catch(error => console.log(error));
    
  }

  postComment() {
    console.log('Posting comment');
    const imageID = this.state.image._id;

    var commentBody = {
      email: this.state.user,
      body: this.state.comment,
      photoID: imageID
    }

    var queryURL = 'http://10.142.85.95:8080/photos/comment/add/' + imageID;
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
      this.setState({comments});
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
              ref="comment"
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
        (this.state["comments"].length !== 0) ? 

          this.state["comments"].map((comment, i) => {
            return(
              <Card key={i}>
                <CardItem>
                  <Text style={styles.userName}>{this.state.user}</Text>
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
