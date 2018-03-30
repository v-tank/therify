import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import Grid from 'react-native-grid-component';
import images from './data.json';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;

export default class Feed extends Component {

  state = {
    images
  }

  componentDidMount() {
    this.setState({ images });
    // debugger;
    // console.log(this.data);
  }

  _renderItem = (data, i) => (

    <TouchableWithoutFeedback key={data.id} onPress={() => alert(`${data.id} was pressed!`)}>
      <View style={styles.item}>
        {/* <View style={[{ backgroundColor: data }, styles.item]} key={i} /> */}
        <Image
          source={{ uri: data.image }}
          style={styles.item}
        />
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.images}
        itemsPerRow={3}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: imageWidth,
    margin: 1,
    borderWidth: 1,
    borderColor: '#cccccc'
  },
  list: {
    flex: 1,
  }
});