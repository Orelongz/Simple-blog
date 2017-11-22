var mongoose		= require("mongoose"),
	express			= require("express"),
	router			= express.Router(),
	Blog 			= require("./../models/blog"),
	Comment 		= require("./../models/comment"),
	middlewareObj	= require("./../middleware");



//===============
// GET REQUESTS
//===============


// GET ALL BLOG POSTS
router.get("/", function(req, res) {
	var notFound = null;
	if(req.query.q) {
		var regex = new RegExp(middlewareObj.escapeRegex(req.query.q), 'gi');
		Blog.find({"title": regex}, function(err, blogs){
			if (err) {
				req.flash("error", err.message);
				res.redirect("back");	
			} else  if (blogs.length == 0) {
				notFound = (req.query.q);
			}
			res.render("index", {blogs: blogs, notFound: notFound});
		});
	} else {
		Blog.find({}, function(err, blogs){
			if (err) {
				req.flash("error", err.message);
				res.redirect("back");	
			}else {
				res.render("index", {blogs: blogs, notFound: notFound});
			}
		});
	}
});

// GETS PAGE TO CREATE NEW BLOG POST
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
	res.render("new");
});

// GETS THE DETAILS OF INDIVIDUAL BLOGS
router.get("/:id", function(req, res) {
	Blog.findById(req.params.id).populate("comments").exec(function(err, blog) {
		if (err) {
			res.redirect("/blog");
		}
		res.render("show", {blog: blog});
	});
});

// GETS THE PAGE TO EDIT A BLOG
router.get("/:id/edit", middlewareObj.checkBlogOwnership, function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		res.render("edit", {blog: blog});
	});
});


//===============
// POST REQUESTS
//===============

// POSTS A NEW BLOG
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
	req.body.blog.story = req.sanitize(req.body.blog.story);
	req.body.blog.author = {
		id: req.user._id,
		username: req.user.username
	};
	Blog.create(req.body.blog, function(err, blog) {
		if (err){
			req.flash("error", err.message);
			res.redirect("back");	
		} else {
			res.redirect("/blog/" + blog._id);
		}
	});		
});


//===============
// PUT REQUESTS
//===============

// POSTS THE EDITTED BLOG
router.put("/:id", middlewareObj.checkBlogOwnership, function(req, res) {
	req.body.blog.story = req.sanitize(req.body.blog.story);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
		res.redirect("/blog/" + req.params.id);
	});
});


//===============
// DELETE REQUESTS
//===============

// DELETES AN EXISTING BLOG
router.delete("/:id", middlewareObj.checkBlogOwnership, function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err) {
		req.flash("success", "Blog deleted");
		res.redirect("/blog");
	});
});


module.exports = router;