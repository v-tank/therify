const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
	image: { data: Buffer, contentType: String, required: true },
	location: { type: String, required: true },
	date: { type: Date, default: Date.now },
	user: { type: [Schema.Types.ObjectId], ref: "User" }
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;