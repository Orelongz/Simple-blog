var express		= require("express"),
	User 		= require("./../models/user"),
	middlewareObj = require("./../middleware"),
	passport	= require("passport"),
	router		= express.Router();




// GETS THE SIGNUP PAGE
router.get("/signup", function(req, res) {
	res.render("signup");
});

// GETS THE SIGNIN PAGE
router.get("/signin", function(req, res) {
	res.render("signin");
});

// SIGNS UP A USER TO THE WEB APP
router.post("/signup", middlewareObj.validation, function(req, res) {
	var name 	= req.body.firstname + " " + req.body.surname;
	var newUser = new User({
		name: name,
		username: req.body.username,
		email: req.body.email
	});
	User.register(newUser, req.body.password, function(err, user) {
			if (err) {
				req.flash("error", err.message);
				res.redirect("/signup");
			} else {
				passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to myBlog " + user.username);
				res.redirect("/blog");
			});
		}
	})
});


// SIGN IN A USER INTO THE WEB APP
router.post("/signin", passport.authenticate("local", {
	successRedirect: "/blog",
	failureRedirect: "/signin"
	}), function(req, res) {
});


router.get("/signout", function(req, res) {
	req.logout();
	req.flash("success", "Signed Out.");
	res.redirect("/blog");
});

module.exports = router;