var mongoose		= require("mongoose"),
	express			= require("express"),
	router			= express.Router({mergeParams: true}),
	Blog 			= require("./../models/blog"),
	Comment 		= require("./../models/comment"),
	middlewareObj	= require("./../middleware");


// POSTS A COMMENT TO A BLOG PAGE
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err || !blog) {
			req.flash("error", "Blog post not found");
			res.redirect("/blog");
		} else {
			Comment.create({comment: req.body.comment}, function(err, comment) {
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				blog.comments.push(comment);
				blog.save();
				res.redirect("/blog/" + req.params.id);
			});
		}
	});
});


// GETS THE COMMENT PAGE THAT IS TO BE EDITED
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err || !blog) {
			req.flash("error", "Blog post does not exist.");
			res.redirect("/blog");
		} else {
			Comment.findById(req.params.comment_id, function(err, comment) {
				res.render("comments/commentedit", {comment: comment, id: req.params.id});
			});
		}
	});
})

// UPDATES THE COMMENT
router.put("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err || !blog) {
			req.flash("error", "Blog post does not exist.");
			res.redirect("/blog");
		} else {
			Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdate) {
				res.redirect("/blog/" + req.params.id);
			});
		}
	});
})

// DELETES A COMMENT
router.delete("/:comment_id/delete", middlewareObj.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		res.redirect("/blog/" + req.params.id);
	})
})





module.exports = router;