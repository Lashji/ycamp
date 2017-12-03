var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {



        Campground.findById(req.params.id, (err, foundCampground) => {
            if (!err) {


                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                
                if (foundCampground.author.id.equals(req.user.id) || req.user.isAdmin) {

                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    
                    res.redirect("back");
                }
            } else {
                req.flash("error", "Campground not found!");
                
                console.log(err);
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        
        
        
                Comment.findById(req.params.comment_id, (err, foundComment) => {
                    if (!err) {
                        if (foundComment.author.id.equals(req.user.id) || req.user.isAdmin) {
        
                            next();
                        } else {
                            req.flash("error", "You don't have permission to do that!");
                            res.redirect("back");
                        }
                    } else {
                        console.log(err);
                        res.redirect("back");
                    }
                });
            } else {
                req.flash("error", "You need to be logged in to do that!");
                res.redirect("back");
            }
}
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {

        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");

}



module.exports = middlewareObj;