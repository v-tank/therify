const db = require("../models");

module.exports = {
	add: function(req, res) { //add a user to the db
		db.User
			.create(req.body)
			.then(createdUser => res.json(createdUser))
			.catch(err => res.status(422).json(err));
	},
<<<<<<< HEAD
=======
	get: function(req, res) {
		db.User.findOne({email: req.body.email})
			.then(foundUser => res.json(foundUser))
			.catch(err => res.status(422).json(err));
	},
>>>>>>> 3678b4cf37f77b93bc98c7723b3ba7fc9fcb6f94
	getPhotos: function(req, res) {

	}
};