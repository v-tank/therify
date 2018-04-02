import React from 'react';
import {AsyncStorage,Button,TextInput,Image,KeyboardAvoidingView,
  StyleSheet,View,TouchableOpacity,Text,ScrollView} from 'react-native';
import { FileSystem, } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";

const pictureSize = 150;

export default class GalleryScreen extends React.Component {
  state = {
    //photos: [],
    showUploadPage:false,
    currentPhoto: null,
    currentPhotoTitle: null,
    currentPhotoAbout: null,
  };
  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    //NEEDED??
    // FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos').then(photos => {
    //   if (this._mounted) { this.setState( { photos, }, ); }
    // });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  async uploadPhoto (photoUri) {
    var userEmail = await AsyncStorage.getItem('userEmail').catch(err => {
      console.log(err);
      return; //cancels the upload if error
     });

    //TODO: Get the photo's actual location
    var photo = {
      image: this.state.currentPhoto,
      fileType: 'jpg',
      location: '37.8287656 -122.4860667',
      email: userEmail,
      title: this.state.currentPhotoTitle,
      description: this.state.currentPhotoAbout
    }

    fetch('http://10.142.182.123:8080/photos', {
      method: 'POST',
      body: JSON.stringify(photo),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {          
      //TODO: notify that upload was successful, remove the uploaded photo from the UI
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
            {this.props.photos.map(photoData => (
              <View style={styles.pictureWrapper} key={photoData}>
                <Image
                  key={photoData}
                  style={styles.picture}
                  source={{uri: photoData}}
                />
                <Button 
                  style={styles.uploadButton} 
                  title="Post Photo"
                  onPress={()=>{ this.showUploadScreen(photoData); }}
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
        <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoid}>
          <ScrollView contentComponentStyle={{ flex: 1 }}>
            <View style={styles.uploadPictureWrapper} key={this.state.currentPhoto}>
              <Image
                key={this.state.currentPhoto}
                style={styles.picture}
                source={{ uri: this.state.currentPhoto }}
              />
            </View>
            <View style={styles.infoAreaView}>
              <TextInput
                ref="title"
                placeholder="Title"
                style={styles.titleTextArea}
                onChangeText={(text) => this.setState({currentPhotoTitle:text})}
              />
              <TextInput
                ref="summary"
                placeholder="About Photo"
                style={styles.summaryTextArea}
                onChangeText={(text) => this.setState({currentPhotoAbout:text})}
              />
              <Button 
                title="Upload"
                onPress={this.handleUpload}
                style={styles.uploadPhotoButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };

  //should we just call uploadPhoto directly?
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
    marginBottom: 5,
    backgroundColor: 'blue',
  },
  titleAreaView:{
    
  },
  titleTextArea:{
    height: 40, 
    fontSize: 20, 
    textAlign: 'center', 
    flexDirection: 'row',
    flex: 1, 
    backgroundColor: '#eeeeee', 
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  summaryTextArea:{
    height: 70, 
    fontSize: 15, 
    textAlign: 'center', 
    flexDirection: 'row',
    flex: 1, 
    backgroundColor: '#eeeeee', 
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  uploadPhotoButton:{ 
    flex: 1, 
    fontSize: 20, 
    backgroundColor: '#e8195b', 
    paddingTop: 5, 
    paddingBottom: 5, 
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
});
