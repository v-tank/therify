const db = require("../models");

module.exports = {
	add: function(req, res) { //add a photo to the db
		db.Photo
			.create(req.body)
			.then(createdPhoto => res.json(createdPhoto))
			.catch(err => res.status(422).json(err));
	},
	getWithComments: function(req, res) { //get a specific photo and its comments
		
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