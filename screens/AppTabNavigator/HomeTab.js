//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, Icon, Header, Left, Right, Body } from 'native-base';
import CardComponent from '../../components/CardComponent';
import MapComponent from '../../components/MapComponent';
import { TextInput, FlatList, Button } from 'react-native';

// create a component
class HomeTab extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Icon name="ios-home" style={{color: tintColor}} />
    )
  }
  searchPressed() {
    console.log("button pressed");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#e8195b'}}>
          <Left><Icon name="ios-send-outline" style={{ paddingLeft: 10 }} /></Left>
          <Body><Text>Therify</Text></Body>
          <Right><Icon name="ios-camera-outline" style={{paddingLeft: 10}} /></Right>
        </Header>
        <TextInput placeholder="Search"/>
        <Button title="Search" onPress={this.searchPressed}/>
        <MapComponent/>
        <Text>Location</Text>
        <FlatList
          contentContainerStyle={styles.list}
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
        {/*
        <Content>
          <CardComponent 
          imageSource="1"
          therifies="301"/>
        
        </Content>
        */}
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
  list: {
    justifyContent: 'center',
    flexDirection: 'row'
    //flexWrap: 'wrap'
  }
});

//make this component available to the app
export default HomeTab;
