import React from 'react';
import {AsyncStorage,Button,TextInput,Image,KeyboardAvoidingView,
  StyleSheet,View,TouchableOpacity,Text,ScrollView,Dimensions} from 'react-native';
import { FileSystem, } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";

const pictureSize = 150;
const deviceWidth = Dimensions.get('window').width;

export default class GalleryScreen extends React.Component {
  state = {
    photos: [],
    showUploadPage:false,
    currentPhoto: null,
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
      image: this.state.currentPhoto,
      fileType: 'jpg',
      location: '37.8287656 -122.4860667',
      email: userEmail
    }

    fetch('http://localhost:8080/photos', {
      method: 'POST',
      body: JSON.stringify(photo),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {          
      console.log(response);
      console.log(response);
    }).catch(error => console.log(error));
  }

  renderGalleryScreen(){
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={this.props.onPress}>
          <Text style={{color: 'white', fontSize: 18, alignSelf: 'center', justifyContent: 'center'}}>Back</Text>
        </TouchableOpacity>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.props.photos.map(photoData => (
              <View style={styles.pictureWrapper} key={photoData}>
                <Image
                  key={photoData}
                  style={styles.picture}
                  source={{uri: photoData}}
                />
                <TouchableOpacity
                  onPress={() => { this.showUploadScreen(photoData); }}
                  style={styles.uploadButton}
                >
                  <Text style={styles.text}>Post Photo</Text>
                </TouchableOpacity>
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
          <Text style={{ color: 'white', fontSize: 18, alignSelf: 'center', justifyContent: 'center'}}>Go To Gallery</Text>
        </TouchableOpacity>
        
        <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoid}>

          <ScrollView contentComponentStyle={{ flex: 1 }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <View style={styles.uploadPictureWrapper} key={this.state.currentPhoto}>
                  <Image
                    key={this.state.currentPhoto}
                    style={{flex: 2}}
                    source={{ uri: this.state.currentPhoto }}
                  />
                </View>
              </View>
              <View style={{flex: 3}}>
                <View style={styles.infoAreaView}>

                  <TextInput
                    ref="title"
                    placeholder="Title"
                    style={styles.titleTextArea}
                    onChangeText={(text) => this.setState({currentPhotoTitle:text})}
                  />

                  <TextInput
                    ref="summary"
                    placeholder="Write a caption..."
                    style={styles.summaryTextArea}
                    onChangeText={(text) => this.setState({currentPhotoAbout:text})}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={this.handleUpload}
              style={styles.uploadButton}
            >
              <Text style={styles.text}>Therify</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };

  handleUpload = () => {
    //console.log("That state: "+JSON.stringify(this.state, null ,2));
    this.uploadPhoto().then( function(err,something){
      if(err){ console.log("error");}
    });
    this.showGalleryScreen();
  }

  showGalleryScreen(){
    this.setState({showUploadPage:false });
  };

  showUploadScreen(photoData) {
    this.setState({
      showUploadPage: true,
      currentPhoto: photoData,
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
    backgroundColor: 'white'
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  picture: {
    width: pictureSize,
    height: pictureSize
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    margin: 5,
  },
  uploadPictureWrapper: {
    width: 75,
    height: 75,
    margin: 5,
  },
  backButton: {
    padding: 20,
    marginBottom: 4,
    backgroundColor: '#e8195b',
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderRadius: 50, borderWidth: 2, borderColor: '#e8195b', margin: 10
  },
  titleAreaView:{
    
  },
  titleTextArea:{
    height: 40, 
    fontSize: 20, 
    textAlign: 'center', 
    flexDirection: 'row',
    flex: 1, 
    backgroundColor: '#fdfdfd', 
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 1
  },
  summaryTextArea:{
    height: 140, 
    fontSize: 18,
    textAlign: 'center', 
    flexDirection: 'row',
    flex: 1, 
    backgroundColor: '#fdfdfd', 
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 1
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  text: {
    color: '#e8195b',
    fontSize: 16
  }
});
