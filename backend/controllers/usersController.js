const db = require("../models");

module.exports = {
<<<<<<< HEAD
	login: function(req, res) {
		
	},
=======

>>>>>>> 71afac1734f9f128a0ea6cefc642ff9f6340a405
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