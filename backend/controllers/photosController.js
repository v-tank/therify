const db = require("../models");

module.exports = {
	add: function(req, res) {
		db.User.findOne({email: req.body.email})
			.then(user => {
				var photo = {
					image: req.body.image,
      				fileType: req.body.fileType,
      				location: req.body.location,
      				user: user.id,
      				title: req.body.title,
      				description: req.body.description
				};
				db.Photo.create(photo)
					.then(createdPhoto => {
						console.log('Photo in the DB!');
						db.User
							.findOneAndUpdate({email:req.body.email},{$push:{photos: createdPhoto.id}})
							.then(updatedUser => res.json(updatedUser))
							.catch(err => {console.log(err)});
					})
			});
	},
	remove: function(req, res) {
		db.Photo.findOne({id:req.body.id}).then(photo =>{
			photo.remove();
		}).then(photo => { //just in case it doesn't cascade delete...
			photo.comments.forEach(comment => {
				db.Comment.findOne({id:comment.id}).then(comment=> {
					comment.remove();
				}).catch(err => {
					console.log(err);
				});
			});
			//send the deleted photo back in case the client wants to do something with it
			res.json(photo);
		}).catch(err => {
			console.log(err);
		});
	},
	getWithComments: function(req, res) {
		let photoWithComments = {
      		user: '',
			photo: null,
			comments: []
    	};
	    db.Photo.findOne({_id: req.params.id})
			.then(photo =>{
		        // console.log(photo);
		        photoWithComments.photo = photo;
		        // console.log(photoWithComments.photo);
		        //get all of the photo's comments
		        db.User.findOne({_id: photo.user[0]}).then(user => {
					photoWithComments.user = user.email;
					photoWithComments.comments = getAllComments(photo.comments, 0, photoWithComments, res);
					// console.log(photoWithComments.comments.length);
					res.json(photoWithComments);
				})
			}).catch(err => {
				console.log(err);
			});
	},
	findByLocation: function(req, res) {
		if(req.body.location === ' ') {
			console.log("Received request for photos with no location given, returning empty array");
			res.json([]);
		} else {
			process.stdout.write("Given location: ");
			console.log(req.body.location);
			// console.log(typeof(req.body.location));
			//request has range and location
			db.Photo.find().then(photos => {
				var results = [];
				var requestLocation = parseLocation(req.body.location);
				photos.forEach(photo => {
					if(global_dist(requestLocation, parseLocation(photo.location), req.body.range)) {
						results.push(photo);
					}
				});
				console.log("Number of photos in range: " + results.length);
				res.json(results);
			}).catch(err => {
				res.json(err);
			});
		}
	},
	findByLocationAndDate: function(req, res) { //THIS FUNCTION WILL NOT BE INCLUDED IN APP PROTOTYPE
		this.findByLocation(req, res);
	},
	addComment: function(req, res) {
		//get the ID of the user who made the comment
		db.User.findOne({email: req.body.email})
			.then(user => {
				var comment = {
					body: req.body.body,
					user: user.id
				};
				//create the comment
				db.Comment.create(comment)
					.then(newComment => {
						//add the comment to the photo
						db.Photo.findOneAndUpdate(
							{ id: req.body.photoID },
							{ $push: {comments: newComment.id} },
							{ new: true } //it returns the updated photo, instead of its original state
						).then(photoWithAddedComment => {
							res.json(newComment);
							//could choose to return the update photo instead?
						}).catch(err => {
							console.log(err);
						})
					});
			});
		
	},
	removeComment: function(req, res) {
		db.Comment.findOne({id: req.body.id})
			.then(comment => {
				comment.remove(); //should cascade delete from its photo's comment list
			});
	}
};

//helper function that recursively fills an array with the comments of a given photo.
//takes an array of the comment ids, the index of the current comment in that array,
//the object that holds the array to be filled with the comment objects, 
//and the response to be sent back to the server
function getAllComments(ids, index, photoWithComments, res){
	if(index === ids.length){
    // console.log('in if');
    // console.log(photoWithComments.photo.verified);
    // res.json(photoWithComments);
    return photoWithComments.comments;
	} else{
		db.Comment.findOne({id: ids[index]})
		.then(comment =>{
      // console.log('in else');
			photoWithComments.comments.push(comment);
			getAllComments(ids, index + 1, photoWithComments, res);
		});
	}
}


// function removeAllComments(){
// 	if(index === ids.length){
// 		return;
// 	} else{
// 		db.Comment.findOne({id: ids[index]})
// 		.then(comment =>{
// 			comments.push(comment);
// 			getAllComments(ids,index+1,comments);
// 		});
// 	}
// }

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
        return degrees * (pi/180);
    }
	const earth_rad = 6371;
    let ch_lat = Math.abs(f_lat - st_lat);
    ch_lat = degrees_to_radians(ch_lat);
    let ch_long = Math.abs(f_long- st_long);
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
