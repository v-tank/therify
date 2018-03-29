const db = require("../models");

module.exports = {
	add: function(req, res) { //add a photo to the db
		db.Photo
			.create(req.body)
			.then(createdPhoto => db.User.findOneAndUpdate({ email: req.body.email }, { $push: { photos: createdPhoto.id } }))
			.then(updatedUser => res.json(updatedUser))
			.catch(err => res.status(422).json(err));
	},
	getWithComments: function(req, res) { //get a specific photo and its comments
		var photoWithComments = { photo: null, comments: [] };
	},
	remove: function(req, res) { //also remove associated comments

	},
	findByLocation: function(req, res) {

	},
	findByLocationAndDate: function(req, res) {

	},
	addComment: function(req, res) {

	},
	removeComment: function(req, res) {

	}
};

function getAllComments(ids, index, comments) {
	if(index === ids.length) {
		return comments;
	} else {
		db.Comment.findOne({id: ids[index]})
			.then(comment => {
				comments.push(comment);
				getAllComments(ids, index + 1, comments);
			});
	}
}

// https://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(position1, position2) {
	//convert strings to lats and longs


	// φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
	// note that angles need to be in radians to pass to trig functions!
	// var R = 6371e3; // metres
	// var φ1 = lat1.toRadians();
	// var φ2 = lat2.toRadians();
	// var Δφ = (lat2-lat1).toRadians();
	// var Δλ = (lon2-lon1).toRadians();

	// var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	//         Math.cos(φ1) * Math.cos(φ2) *
	//         Math.sin(Δλ/2) * Math.sin(Δλ/2);
	// var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	// var d = R * c;

	// return d;
}