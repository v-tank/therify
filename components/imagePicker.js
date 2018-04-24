import React from 'react';
import { ScrollView, View } from 'react-native';
import { ImagePicker } from 'expo';
import ListButton from './ListButton';
import MonoText from './MonoText';

export default class ImagePickerScreen extends React.Component {

  state = {
    selection: null,
  };

  render() {
    const showCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({});
      if (result.cancelled) {
        this.setState({ selection: null });
      } else {
        this.setState({ selection: result });
      }
    };

    const showPicker = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({});
      if (result.cancelled) {
        this.setState({ selection: null });
      } else {
        this.setState({ selection: result });
      }
    };

    const showPickerWithEditing = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
      if (result.cancelled) {
        this.setState({ selection: null });
      } else {
        this.setState({ selection: result });
      }
    };

    return (
      <View>
        <ScrollView style={{ padding: 10 }}>
          <ListButton onPress={showCamera} title="Open camera" />
          <ListButton onPress={showPicker} title="Pick photo or video" />
          <ListButton onPress={showPickerWithEditing} title="Pick photo and edit" />

          {this._maybeRenderSelection()}
        </ScrollView>
      </View>
    );
  }

  _maybeRenderSelection = () => {
    const { selection } = this.state;

    if (!selection) {
      return;
    }

    const media =
      selection.type === 'video' ? (
        <Video
          source={{ uri: selection.uri }}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
          shouldPlay
          isLooping
        />
      ) : (
        <Image
          source={{ uri: selection.uri }}
          style={{ width: 300, height: 300, resizeMode: 'contain' }}
        />
      );

    const result = (
      <MonoText>{JSON.stringify(selection, null, 2)}</MonoText>
    );

    return (
      <View style={{ marginVertical: 16 }}>
        <View style={{ marginBottom: 10, alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#000000' }}>
          {media}
        </View>
        {result}
      </View>
    );
  };
}