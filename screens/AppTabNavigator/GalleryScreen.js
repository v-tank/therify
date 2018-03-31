import React from 'react';
import { AsyncStorage, Button, Image, StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { FileSystem, } from 'expo';
//const exif=require("jpeg-exif");

const pictureSize = 150;

export default class GalleryScreen extends React.Component {
  state = {
    images: {},
    photos: [],
  };
  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos').then(photos => {
      if (this._mounted) {
        this.setState( { photos, }, );
      }
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  async uploadPhoto (photoUri) {
    //TODO: Upload an image to the server
    let imgUri =`${FileSystem.documentDirectory}photos/${photoUri}`;
    
    var userEmail = await AsyncStorage.getItem('userEmail').catch(err => {
      console.log(err);
      return;
     });

    var image = FileSystem.readAsStringAsync(imgUri).catch(err => {
      console.log("Error converting file to string:");
      console.log(err);
    });

    var photo = {
      image: image,
      fileType: imgUri.split('.')[1],
      location: '',
      email: userEmail
    }

    // fetch('http://10.0.1.59:8080/photos', {
    //       method: 'POST',
    //       body: ,
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     }).then(response => {          

    //     }).catch(error => console.log(error));
  }

  getImageDimensions = ({ width, height }) => {
    if (width > height) {
      const scaledHeight = pictureSize * height / width;
      return {
        width: pictureSize,
        height: scaledHeight,
        scaleX: pictureSize / width,
        scaleY: scaledHeight / height,
        offsetX: 0,
        offsetY: (pictureSize - scaledHeight) / 2,
      };
    } else {
      const scaledWidth = pictureSize * width / height;
      return {
        width: scaledWidth,
        height: pictureSize,
        scaleX: scaledWidth / width,
        scaleY: pictureSize / height,
        offsetX: (pictureSize - scaledWidth) / 2,
        offsetY: 0,
      };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={this.props.onPress}>
          <Text>Back</Text>
        </TouchableOpacity>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.state.photos.map(photoUri => (
              <View style={styles.pictureWrapper} key={photoUri}>
                <Image
                  key={photoUri}
                  style={styles.picture}
                  source={{
                    uri: `${FileSystem.documentDirectory}photos/${photoUri}`,
                  }}
                />
                <Button 
                  style={styles.uploadButton} 
                  title="Post Photo"
                  onPress={()=>this.uploadPhoto(photoUri)}
                > </Button>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  picture: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: 'contain',
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    margin: 5,
  },
  backButton: {
    padding: 20,
    marginBottom: 4,
    backgroundColor: 'indianred',
  },
  uploadButton: {
    padding: 10,
    marginBottom: 4,
    backgroundColor: 'blue',
  }
});
