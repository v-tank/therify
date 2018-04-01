import React from 'react';
import {AsyncStorage,Button,TextInput,Image,StyleSheet,View,TouchableOpacity,Text,ScrollView} from 'react-native';
import { FileSystem, } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";

const pictureSize = 150;

export default class GalleryScreen extends React.Component {
  state = {
    photos: [],
    showUploadPage:false,
    currentPhotoUri: null,
    currentPhotoTitle: null,
    currentPhotoAbout: null,
  };
  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos').then(photos => {
      if (this._mounted) { this.setState( { photos, }, ); }
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  async uploadPhoto (photoUri) {
    //TODO: Upload an image to the server
    var userEmail = await AsyncStorage.getItem('userEmail').catch(err => {
      console.log(err);
      return;
     });

    var photo = {
      image: photoUri,
      fileType: 'jpg',
      location: '37.8287656 -122.4860667',
      email: userEmail
    }

    fetch('http://10.0.1.59:8080/photos', {
          method: 'POST',
          body: JSON.stringify(photo),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {          
          console.log(response);
        }).catch(error => console.log(error));
  }

  renderGalleryScreen(){
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
                  source={{ uri: `${FileSystem.documentDirectory}photos/${photoUri}`, }}
                />
                <Button 
                  style={styles.uploadButton} 
                  title="Post Photo"
                  onPress={()=>{ this.showUploadScreen(photoUri); }}
                > </Button>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  renderUploadScreen(){
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={this.showGalleryScreen.bind(this)}>
          <Text>Go To Gallery</Text>
        </TouchableOpacity>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.uploadPictureWrapper} key={this.state.currentPhotoUri}>
            <Image
              key={this.state.currentPhotoUri}
              style={styles.picture}
              source={{ uri: this.state.currentPhotoUri }}
            />
          </View>
          <View style={styles.titleAreaView}>
            <TextInput
              ref="title"
              placeholder="Title"
              style={styles.titleTextArea}
              onChangeText={(text) => { this.handleTextInputChange(text) }}
            />
            <TextInput
              ref="summary"
              placeholder="Summary"
              style={styles.summaryTextArea}
              onChangeText={(text) => { this.handleTextInputChange(text) }}
            />
            <Button 
              title="Upload"
              onPress={this.handleUpload}
              style={styles.uploadPhotoButton}
            />
          </View>
        </ScrollView>
      </View>
    );
  };

  handleUpload = () => {
    //TODO: handle all the image upload stuffs here
  }
  handleTextInputChange = (text) => {

  }

  showGalleryScreen(){
    console.log("Show upload page is: "+ JSON.stringify(this.state));
    this.setState({showUploadPage:false });
  };

  showUploadScreen(photoUri) {
    this.setState({
      showUploadPage: true,
      currentPhotoUri: `${FileSystem.documentDirectory}photos/${photoUri}`,
    });
  };

  render() {
    const content = this.state.showUploadPage
      ? this.renderUploadScreen() : this.renderGalleryScreen();
    return <View style={styles.container}>{content}</View>;
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
  uploadPictureWrapper: {
    width: 300,
    height: 200,
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
  },
  titleTextArea:{
    flexDirection: 'row',
    margin: 10, 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  summaryTextArea:{
    height: 80, 
    fontSize: 15, 
    textAlign: 'center', 
    flex: 5, 
    backgroundColor: '#eeeeee', 
    marginRight: 10 
  },
  uploadPhotoButton:{ 
    flex: 1, 
    fontSize: 20, 
    backgroundColor: '#e8195b', 
    color: 'white', 
    paddingLeft: 30, 
    paddingTop: 5, 
    paddingBottom: 5 
  }
});
