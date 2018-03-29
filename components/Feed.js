import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import Grid from 'react-native-grid-component';
import data from './data.json';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;

export default class Simple extends Component {

  state = {
    data
  }

  componentDidMount() {
    this.setState({ data });
  }

  _renderItem = (data, i) => (
    <View style={styles.item} key={i} >
      <Image
        source={{ uri: data.image }}
      />
    </View>
  );

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.data}
        itemsPerRow={3}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: imageWidth,
    margin: 1
  },
  list: {
    flex: 1,
  }
});