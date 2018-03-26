const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	body: { type: String, required: true },
	user: { type: [Schema.Types.ObjectId], ref: "User" }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
