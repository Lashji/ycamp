var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var mw = require("../middleware");


router.get("/new", mw.isLoggedIn, (req, res) => {

    Campground.findById(req.params.id, (err, data) => {
        if (!err) {
            // console.log(data)
            res.render("comments/new", {
                campground: data
            });
        }

    });


})


router.post("/", mw.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {


            Comment.create(req.body.comment, (err, comment) => {
                if (!err) {
                    // add username and id to comment
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Comment created!");
                    res.redirect("/campgrounds/" + camp._id);
                } else {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }

            });
        }
    });


});

// Edit route
router.get('/:comment_id/edit', mw.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (!err) {
            Campground.findById(req.params.id, (err, foundCamp) => {
                res.render("comments/edit", {
                    comment: foundComment,
                    campground: foundCamp
                });
            })
            
        }

    });
});

// update route
router.put('/:comment_id', mw.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,(err, val) => {
        if (!err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("back");
        }
    });
});

// Delete route

router.delete('/:comment_id', mw.checkCommentOwnership, (req, res) => {

    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (!err) {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            redirect("back");
        }

    });


});



module.exports = router;