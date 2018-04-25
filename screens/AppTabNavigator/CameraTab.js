// import components
import {Feather as Icon } from "@expo/vector-icons";
import { Location, Constants, Camera, Permissions, ImageManipulator } from 'expo';
import React ,{Component} from 'react';
import { AsyncStorage, StyleSheet, Text, View, TouchableOpacity, Slider, Vibration, } from 'react-native';
import GalleryScreen from './GalleryScreen';

const landmarkSize = 2;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

// create a component
export default class CameraTab extends Component {

  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    showGallery: false,
    photos: [],
    permissionsGranted: false,
  };

  static navigationOptions = {
    header: {
      visible: false,
    }
  }

  getPhotoId(uri){
    //grabs the filename of the image
    let myArr = uri.split('/'); 
    return myArr[myArr.length-1];
  }

  // function that extracts the current location, time, and converts an image to base64 upon capture
  takePicture = async function() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status==='granted'){ 
      try {
        var result = await Location.getCurrentPositionAsync({ enableHighAccuracy: true, });
      }catch(err){
        console.log("Take Pic Error Location: "+error);
      } finally {
        var base64= null;
        
        if (this.camera) {
          let myDate = new Date(Date.now());
          let time = myDate.toLocaleString();
          
          this.camera.takePictureAsync({quality: 1, base64: true}).then(data => {
            
            base64 = 'data:image/jpg;base64,' + data.base64;
            
            let photoArray = this.state.photos;
            
            //create thumbnail
            ImageManipulator.manipulate(
              data.uri, [{width: 256, height: 256}], {format: 'jpg', base64: true}
            ).then(thumbnail => {
              photoArray.push({
                photo:base64,
                thumbnail: 'data:image/jpg;base64,' + thumbnail.base64,
                location: `${result.coords.latitude} ${result.coords.longitude}`,
                date: time,
              });
              this.setState({photos: photoArray});
              Vibration.vibrate(); // Vibrate the phone when a picture is taken
            }).catch(err => {
              console.log(err);
            });
          });
        }
      }
    } else if (status !== 'granted') { 
      var base64= null;
      if(this.camera){
        let myDate = new Date(Date.now());
        let time = myDate.toLocaleString();
        this.camera.takePictureAsync({quality: 1, base64: true}).then(data => {
          base64 = 'data:image/jpg;base64,' + data.base64;
          let photoArray = this.state.photos;
          photoArray.push({
            photo:base64,
            location: "no location data available",
            date: time,
          });
          this.setState({photos: photoArray});
        });
        Vibration.vibrate();
      }
    }
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === 'granted' });
  }

  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
    });
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  // Renders the gallery screen when the button is pressed
  renderGallery() {
    return <GalleryScreen onPress={this.toggleView.bind(this)} deletePhoto={this.deletePhoto.bind(this)} photos={this.state.photos}/>;
  }

  // Deletes a photo from the gallery once it's been uploaded
  deletePhoto(index){
    let photoArray = this.state.photos;
    photoArray.splice(index, 1);
    this.setState({photos: photoArray});
  };

  // Function to alert the user if the app does not have Camera permissions
  renderNoPermissions(){
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}>
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

  // Renders the camera screen with all the buttons
  renderCamera() {
    return (
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}>
        <View
          style={{
            flex: 0.5,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: Constants.statusBarHeight / 2,
          }}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={this.toggleFacing.bind(this)}>
            <Text style={styles.flipText}> FLIP </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={this.toggleFlash.bind(this)}>
            <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={this.toggleWB.bind(this)}>
            <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginBottom: -5,
          }}>
          {this.state.autoFocus !== 'on'
            ? <Slider
                style={{
                  width: 150,
                  marginTop: 15,
                  marginRight: 15,
                  alignSelf: 'flex-end',
                }}
                onValueChange={this.setFocusDepth.bind(this)}
                step={0.1}
              />
            : null}
        </View>
        <View
          style={{
            flex: 0.1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
            onPress={this.zoomIn.bind(this)}>
            <Text style={styles.flipText}> + </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
            onPress={this.zoomOut.bind(this)}>
            <Text style={styles.flipText}> - </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
            onPress={this.toggleFocus.bind(this)}>
            <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.flipButton,
              styles.picButton,
              { flex: 0.3, alignSelf: 'flex-end' },
            ]}
            onPress={this.takePicture.bind(this)}>
            <Text style={styles.flipText}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.flipButton,
              styles.galleryButton,
              { flex: 0.25, alignSelf: 'flex-end' },
            ]}
            onPress={this.toggleView.bind(this)}>
            <Text style={styles.flipText}> Gallery </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }

  // Main function to render the camera or the gallery depending on the user's input
  render() {    
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    const content = this.state.showGallery
      ? this.renderGallery()
      : cameraScreenContent;
    return <View style={styles.container}>{content}</View>;
  }
};

// Defines the StyleSheet
const styles = StyleSheet.create({
  icon: {
    fontSize: 20
  },
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  navigation: {
    flex: 1
  },
  gallery: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  flipText: {
    color: "white",
    fontSize: 15
  },
  item: {
    margin: 4,
    backgroundColor: "#ea2564",
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  picButton: {
    backgroundColor: "darkseagreen"
  },
  galleryButton: {
    backgroundColor: "#ea2564"
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: "absolute",
    backgroundColor: "red"
  },
  row: {
    flexDirection: "row"
  }
});

