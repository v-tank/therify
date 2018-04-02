const db = require("../models");

module.exports = {
	// get: function(req, res) {
	// 	db.User.findOne({email: req.body.email})
	// 		.then(foundUser => res.json(foundUser))
	// 		.catch(err => res.status(422).json(err));
	// },
	login: function(req, res) {
		console.log(req.body);
		db.User
			.findOne({'email': req.body.email})
			.then(result => {
				if(result === null) { //the user was new
					console.log("New user registering.");
					db.User
						.create(req.body)
						.then(newUser => res.json(newUser))
						.catch(err => res.status(422).json(err));
				} else {
					console.log("Existing user returning");
					res.json(result);
				}
			})
			.catch(err => res.status(422).json(err));
	},
	getPhotos: function(req, res) {
		//the request will have the user's email, so find the user with that email
		db.User.findOne({email: req.body.email})
			.then(user => {
				db.Photos.find({user: user.id})
					.then(userPhotos => {
						res.json(userPhotos);
					}).catch(err => console.log(err));
			})
	}
};