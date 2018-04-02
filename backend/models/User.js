const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: { 
		type: String,
		unique: true, 
		required: true,
		match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
	},
	//should users be able to see a list of their photos? Probably.
	//can mongoose handle many to one relationships where we want to be
	//able to access the data from either side?
	photos: { type: [Schema.Types.ObjectId], ref: "Photo" }
	
	//comments?
});

const User = mongoose.model("User", userSchema);

module.exports = User;