var mongoose 	= require("mongoose"),
	Blog 	= require("./blog"),
	passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	email: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
