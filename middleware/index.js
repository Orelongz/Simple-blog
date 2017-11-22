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
			if (err) {
				res.redirect("back");
			} else if (comment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "Kindly sign in");
		res.redirect("back");
	}
}


middlewareObj.checkBlogOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Blog.findById(req.params.id, function(err, blog) {
			if (err) {
				res.redirect("back");
			} else if (blog.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "Kindly sign in");
		res.redirect("back");
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

middlewareObj.escapeRegex = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = middlewareObj;