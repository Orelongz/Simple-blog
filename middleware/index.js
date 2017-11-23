var middlewareObj 	= {},
	Blog 			= require("./../models/blog"),
	Comment 		= require("./../models/comment");


middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You have to be signed in to do that.");
	res.redirect("/signin");
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if (err || !comment) {
				req.flash("error", "comment not available")
				res.redirect("/blog/ " + req.params.id);
			} else if (comment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("/blog/ " + req.params.id);
			}
		});
	} else {
		req.flash("error", "Please do sign in to do that.");
		res.redirect("/signin");
	}
}


middlewareObj.checkBlogOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Blog.findById(req.params.id, function(err, blog) {
			if (err || !blog) {
				console.log(err, blog);
				req.flash("error", "Blog post not found");
				res.redirect("/blog");
			} else if (blog.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("/blog/" + req.params.id);
			}
		});
	} else {
		req.flash("error", "You have to be signed in to do that.");
		res.redirect("/signin");
	}
}

middlewareObj.validation = function(req, res, next) {
	if (req.body.firstname === "" || req.body.surname === "") {
		req.flash("error", "Name fields cannot be left blank");
		res.redirect("back");
	} else if (req.body.password !== req.body.rePassword) {
		req.flash("error", "Your passwords do not match");
		res.redirect("back");
	} else {
		next();
	}
}

middlewareObj.signInValidation = function(req, res, next) {
	if (req.body.username === "" || req.body.password === "") {
		req.flash("error", "Username and password fields cannot be left blank");
		res.redirect("back");
	} else {
		next();
	}
}

middlewareObj.escapeRegex = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = middlewareObj;