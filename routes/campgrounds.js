var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var geocoder = require('geocoder');
var mw = require("../middleware");

router.get('/', function (req, res) {
    // eval(require("locus"));

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        Campground.find({
            name: regex
        }, function (err, allCamps) {
            if (err) {
                console.log(err);
            } else {
                if (allCamps.length < 1) {
                    req.flash("error", "No Camps match that query, Please try with another one");
                    res.redirect("back");
                } else {

                    res.render("campgrounds/index", {
                        camps: allCamps,
                        page: 'campgrounds'
                    });
                }

            }
        });
    } else {
        Campground.find({}, function (err, allCamps) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    camps: allCamps,
                    page: 'campgrounds'
                });
            }
        });
    }
});

router.post("/", mw.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.img;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // var newCamp = {
    //     name: name,
    //     image: image,
    //     description: desc,
    //     author: author,
    //     price: price
    // }
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;

        var newCampground = {
            name: name,
            image: image,
            description: desc,
            price: price,
            author: author,
            location: location,
            lat: lat,
            lng: lng
        };



        Campground.create(newCampground, function (err, newc) {
            if (err) {
                console.log(err);
            } else {
                console.log(newc);

                res.redirect("/campgrounds");
            }
        });
    });
});


router.get('/new', mw.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});



router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });

});

// EDIT ROUTE
router.get('/:id/edit', mw.checkCampgroundOwnership, (req, res) => {




    Campground.findById(req.params.id, (err, foundCampground) => {
        if (!err) {

            res.render("campgrounds/edit", {
                campground: foundCampground
            });

        }
    });




});



// UPDATE ROUTE
router.put("/:id", function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {
            name: req.body.campground.name,
            image: req.body.campground.image,
            description: req.body.campground.description,
            price: req.body.campground.price,
            location: location,
            lat: lat,
            lng: lng
        };
        Campground.findByIdAndUpdate(req.params.id, {
            $set: newData
        }, function (err, campground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});
// router.put('/:id', mw.checkCampgroundOwnership,(req, res) => {
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, update) => {
//         if (!err) {
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });

// });

// Delete Route
router.delete('/:id', mw.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, val) => {
        if (!err) {
            console.log("Remove successful");
            res.redirect("/campgrounds");
        } else {
            console.log(err);
            console.log("failed");
            redirect("/campgrounds/" + req.params.id);
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;