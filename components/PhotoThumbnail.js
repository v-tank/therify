import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;

export default class PhotoThumbnail extends Component {
	state = {
		highlighted: this.props.highlighted
	};

	// componentWillReceiveProps(nextProps) {
 //    	this.setState({highlighted: nextProps.highlighted}, function() {
 //    		console.log(this.state.highlighted);
 //    	});
 //  	}

 //  	componentWillUpdate() {
 //  		console.log("anything???");
 //  	}

	render() {
		return (
		    <TouchableWithoutFeedback 
		        onPress={() => this.props.clickOnPhoto(this.props.data._id)}>
		        <View style={this.state.highlighted ? styles.focused : styles.item}>
		        	<Image 
		            	source={{uri: this.props.data.thumbnail}}
		            	style={styles.image}
		        	/>

					{ 
						this.props.data.verified 
						? 
						<View style={{ position: 'absolute', right: 5, bottom: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#5BBA47', justifyContent: 'center', alignItems: 'center'}} >
					  		<Text style={{ color: 'white' , backgroundColor: 'transparent'}}>✓</Text> 
						</View> 
						:
						<View />
					}
		        </View>
		    </TouchableWithoutFeedback>
    	);
	}
};

// Stylesheet
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: imageWidth,
    margin: 1,
    borderWidth: 1,
    borderColor: '#cccccc'
  },
  image: {
    flex: 1,
    height: imageWidth,
  },
  focused: {
    flex: 1,
    height: imageWidth,
    margin: 1,
    borderWidth: 1,
    borderColor: 'blue'
  }
});