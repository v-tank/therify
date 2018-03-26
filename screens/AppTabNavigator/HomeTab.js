//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Icon, Header, Left, Right, Body } from 'native-base';
import CardComponent from '../../components/CardComponent';

// create a component
class HomeTab extends Component {

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="ios-home" style={{color: tintColor}} />
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#e8195b'}}>
          <Left><Icon name="ios-send-outline" style={{ paddingLeft: 10 }} /></Left>
          <Body><Text>Therify</Text></Body>
          <Right><Icon name="ios-camera-outline" style={{paddingLeft: 10}} /></Right>
        </Header>

        <Content>
          <CardComponent 
          imageSource="1"
          therifies="301"/>
        </Content>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

//make this component available to the app
export default HomeTab;
