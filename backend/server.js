const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var http = require("http");
const socketio = require("socket.io");

//port for the server to use
var PORT = process.env.PORT || 8080;
//====================================================================

//set up server models and controllers
var db = require("./models");
var controllers = require("./controllers");

//set up database

mongoose.Promise = Promise; //Set Mongo to use promises for asynch queries
//connect to database
mongoose.connect("mongodb://therify:Therify18@ds233739.mlab.com:33739/heroku_nmlsd1r4").then(response => console.log("Connected to database."));
//====================================================================

//set up express with routes and bodyparser

var app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({limit: '10mb'})); //for some reason, this is needed to see the body from fetch requests

var routes = require("./routes/routes");
app.use("/", routes);
//====================================================================

//set up socket.io
var server = http.Server(app);
var websocket = socketio(server);
//====================================================================

//start server
server.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
//====================================================================

//socket handling

websocket.on('connection', (socket) => {
    socket.on('feedRequested', (locationRequest) => onFeedRequested(locationRequest, socket));
    socket.on('profileRequested', (profileRequest) => onProfileRequested(profileRequest, socket));
});

//socket.io listeners

function onFeedRequested(locationRequest, socket) {
	process.stdout.write("Given location: ");
	console.log(locationRequest.location);

	//get all the photos and then filter them by location
	db.Photo.find().then(photos => {
		var queryLocation = parseLocation(locationRequest.location);
		photos.forEach(photo => {
			if(global_dist(queryLocation, parseLocation(photo.location), locationRequest.range)) {
				console.log("photo in range, sending photo");
				socket.emit('feedPhoto', photo);
			}
		});
	});
}

function onProfileRequested(profileRequest, socket) {
	db.User.findOne({email: profileRequest.email})
		.then(user => {
			user.photos.forEach(photoID => {
				db.Photo.findOne({_id: photoID})
					.then(photo => {
						if(photo != null) {
							console.log("sending profile photo for " + profileRequest.email);
							socket.emit('authoredPhoto', photo);
						}
					})
			})
		});
}

//====================================================================

//helper functions

function parseLocation(locationString) {
	var location = locationString.split(" ");
	console.log("Parsed location: " + location);
	var lat = parseFloat(location[0]);
	var long = parseFloat(location[1]);
	//check to make sure lat and long are valid
	return [lat, long];
}

//function to calculate if a given location is within a given range
function global_dist(pos1, pos2, range){
    var st_long = pos1[1];
    var st_lat = pos1[0];
    var f_long = pos2[1];
    var f_lat = pos2[0];

    // console.log(pos1);
    // console.log(pos2);

    function degrees_to_radians(degrees){
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
	const earth_rad = 6371000;
    let ch_lat = (f_lat - st_lat);
    ch_lat = degrees_to_radians(ch_lat);
    let ch_long = (f_long - st_long);
    ch_long = degrees_to_radians(ch_long);
	
	const a = Math.pow(Math.sin(ch_lat/2),2) + 
	(Math.cos(st_lat)*Math.cos(f_lat)*Math.pow(Math.sin(ch_long/2),2));

	const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    const ans = earth_rad * c;
    // console.log("location a is ",ans,"km away from location b");
	if (ans <= range){
        // console.log(true);
		return true;
	} else {
        // console.log(false);
		return false;
	}
}