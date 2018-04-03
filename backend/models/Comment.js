const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	body: { 
		type: String, 
		required: true,
		validate: [
			function(input) {
				return input.trim().length > 0;
			},
			"Comment cannot be blank."
		]
	},
	user: { type: Schema.Types.ObjectId, ref: "User" }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
