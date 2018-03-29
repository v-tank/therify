const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
	image: { data: Buffer, type: String, required: true }, //not sure if this is exactly what's needed
	fileType: { type: String, required: true },
	location: { type: String, required: true },
	date: { type: Date, default: Date.now },
	user: { type: [Schema.Types.ObjectId], ref: "User" },
	comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
	rating: Number,
	verified: { type: Boolean, default: false }
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;