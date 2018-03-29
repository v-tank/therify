const db = require("../models");

module.exports = {
	add: function(req, res) {
		db.User.create(req.body)
			   .then(function(){
				   return res.json();
			   }).catch(err =>{
				   if (err){
					   console.log("err adding user. . .");
				   }
			   })

	},
	getPhotos: function(req, res) {

	},
	addPhoto: function(req, res) {

	}
};