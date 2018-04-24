import React from 'react';
import { Alert, AsyncStorage, Button, TextInput, Image, KeyboardAvoidingView, StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions} from 'react-native';
import { FileSystem, } from 'expo';
import { Feather, FontAwesome as Icon } from "@expo/vector-icons";

const pictureSize = 150;
const deviceWidth = Dimensions.get('window').width;

export default class GalleryScreen extends React.Component {
  state = {
    //photos: [],
    showUploadPage:false,
    currentPhotoIndex: null,
    currentPhotoIndexTitle: null,
    currentPhotoIndexAbout: null,
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
      return;
    });

    var photo = {
      image: this.props.photos[this.state.currentPhotoIndex].photo,
      fileType: 'jpg',
      location: this.props.photos[this.state.currentPhotoIndex].location,
      email: userEmail,
      title: this.state.currentPhotoIndexTitle,
      description: this.state.currentPhotoIndexAbout,
      date: this.state.currentPhotoIndex.date,
      verified: true
    }

    fetch('https://therifyserver.herokuapp.com/photos', {
      method: 'POST',
      body: JSON.stringify(photo),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {          
      if(response.status === 200){
        Alert.alert( 'Photo Uploaded',);
        this.props.deletePhoto(this.state.currentPhotoIndex); 
      }
    }).catch(error => console.log(error));
  }

  renderGalleryScreen(){
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={this.props.onPress}>
          <Text style={{color: 'white', fontSize: 22, alignSelf: 'center', justifyContent: 'center', paddingTop: 15 }}>Back</Text>
        </TouchableOpacity>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.props.photos.map( (photoData,index) => (
              <View style={styles.pictureWrapper} key={photoData.photo}>
                <Image
                  key={photoData.photo}
                  style={styles.picture}
                  source={{uri: this.props.photos[index].photo}}
                />
                <TouchableOpacity
                  onPress={() => { this.showUploadScreen(index); }}
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
          <Text style={{ color: 'white', fontSize: 22, alignSelf: 'center', justifyContent: 'center', paddingTop: 15 }}>Go To Gallery</Text>
        </TouchableOpacity>
        
        <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoid}>

          <ScrollView contentComponentStyle={{ flex: 1 }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <View style={styles.uploadPictureWrapper} key={this.state.currentPhotoIndex}>
                  <Image
                    key={this.state.currentPhotoIndex}
                    style={{flex: 2}}
                    source={{ uri: this.props.photos[this.state.currentPhotoIndex].photo }}
                  />
                </View>
              </View>
              <View style={{flex: 3}}>
                <View style={styles.infoAreaView}>

                  <TextInput
                    ref="title"
                    placeholder="Title"
                    style={styles.titleTextArea}
                    underlineColorAndroid="#ffffff"
                    maxLength={22}
                    onChangeText={(text) => this.setState({currentPhotoIndexTitle:text})}
                  />

                  <TextInput
                    ref="summary"
                    placeholder="Write a caption..."
                    multiline={true}
                    numberOfLines={4}
                    maxLength={200}
                    style={styles.summaryTextArea}
                    onChangeText={(text) => this.setState({currentPhotoIndexAbout:text})}
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

  showUploadScreen(index) {
    this.setState({
      currentPhotoIndex: index,
      showUploadPage: true,
    });
  }

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
    backgroundColor: '#ea2564',
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    borderRadius: 50, borderWidth: 2, borderColor: '#ea2564', margin: 10
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
    color: '#ea2564',
    fontSize: 16
  }
});
