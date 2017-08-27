var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//schema start --------
var UserSchema = new mongoose.Schema({
	username: String,
	password: String
})

UserSchema.plugin(passportLocalMongoose);

//compile the above into model.
module.exports = mongoose.model("User", UserSchema);