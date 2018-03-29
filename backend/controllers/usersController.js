const db = require("../models");

module.exports = {
	login: function(req, res) {
		
	},
	add: function(req, res) { //add a user to the db
		db.User
			.insertOne(req.body)
			.then(createdUser => res.json(createdUser))
			.catch(err => res.status(422).json(err));
	},
	get: function(req, res) {
		db.User.findOne({email: req.body.email})
			.then(foundUser => res.json(foundUser))
			.catch(err => res.status(422).json(err));
	},
	getPhotos: function(req, res) {

	}
};