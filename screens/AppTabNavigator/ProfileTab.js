//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Icon, Container, Content, Header, Left, Body, Right, Button, Thumbnail } from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';

// create a component
class ProfileTab extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="ios-person" style={{ color: tintColor }} />
    )
  }
  render() {
    return (
      <Container style={{flex: 1, backgroundColor: 'white' }}>
        <Header style={{backgroundColor: 'white'}}>
          <Left><Icon name="md-person" style={{ paddingLeft: 10 }} /></Left>
          <Body><Text>Username</Text></Body>
          <Right><EntypoIcon name="back-in-time" style={{ paddingLeft: 10, fontSize: 32 }} /></Right>
        </Header>

        <Content>
          <View style={{ padding: 10 }}>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Thumbnail source={require('../../assets/images/icon.png')} style={styles.profileImage} />
              </View>
              <View style={{flex: 3}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <View style={{alignItems: 'center'}}>
                    <Text>24</Text>
                    <Text style={{fontSize: 10, color: 'grey'}}>posts</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text>101</Text>
                    <Text style={{ fontSize: 10, color: 'grey' }}>followers</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text>14</Text>
                    <Text style={{ fontSize: 10, color: 'grey' }}>following</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text style={{ fontWeight: 'bold' }}>User's Name</Text>
              <Text>Description can go here</Text>
            </View>
          </View>
        </Content>

      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5
  }
});

//make this component available to the app
export default ProfileTab;
