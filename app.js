var express 			= require("express"),
	bodyParser 			= require("body-parser"),
	methodOverride 		= require("method-override"),
	mongoose 			= require("mongoose"),
	expressSanitizer 	= require("express-sanitizer"),
	User 				= require("./models/user"),
	Comment 			= require("./models/comment"),
	Blog 				= require("./models/blog"),
	app					= express(),
	passportLocalMongoose = require("passport-local-mongoose"),
	LocalStrategy		= require("passport-local"),
	passport			= require("passport"),
	flash				= require("connect-flash"),
	expressSession		= require("express-session");

var commentRoute		= require("./routes/comment"),
	blogRoute			= require("./routes/blog"),
	indexRoute			= require("./routes/index");



// mongoose.connect("mongodb://localhost/myblog");
mongoose.connect("mongodb://orelongz:orelongz@ds113906.mlab.com:13906/myblog");

// mongoose.connect(process.env.DATABASEURL);

// console.log(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());


app.use(expressSession({
	secret: "Pass-key",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
})


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", indexRoute);
app.use("/blog", blogRoute);
app.use("/blog/:id/comment", commentRoute);





app.get("/", function(req, res) {
	res.redirect("/blog");
});

//===================
// LISTENING ON PORT
//===================

app.listen(process.env.PORT || 8000, process.env.IP, function() {
	console.log("Server started on port 8000");
});

