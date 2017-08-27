var express = require("express");
var app = express();
var ejs = require("ejs");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var User = require("./models/user");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/auth_demo_camp");

app.use(require("express-session")({
	secret: "could be anything",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('port', (process.env.PORT || 2001));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

/**************ROUTES **************/
app.get("/", function(req, res) {
	res.render("home");
});

// here isLoggedIn is a middle ware. 
app.get("/secret", isLoggedIn, function(req, res) {
	console.log("coming to secret");
	res.render("secret");
});

//Auth routes
//show signup form
app.get("/register", function(req, res) {
	res.render("register");
});

app.post ("/register", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.render("register"); 
		} else {
			passport.authenticate("local")(req, res, function(){
				 res.render("secret");
			})
		}
	});
	// res.send("register post route");
});

// login routes
app.get("/login", function(req, res) {
	res.render("login");
});
app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/secret",
		failureRedirect: "/"
	}),
	function(req, res) {
		console.log("in login route");
	}
);

// tell express to listen for requests.
app.listen(app.get('port'), function(){
	console.log("server has started");
});

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

// middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("login");
	}
}

app.use(express.static(__dirname + '/public')); 



