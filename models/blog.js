var mongoose 	= require("mongoose"),
	Comment 	= require("./comment"),
	User 		= require("./user");

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	story: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Blog", blogSchema);
