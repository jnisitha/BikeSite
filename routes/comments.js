var express = require("express");
var router = express.Router({mergeParams: true});//this merges the params defined in bikeroutes.js with the ones here.
var BikeRouteMod = require("../models/bikeroute");
var CommentMod = require("../models/comment");

//=====================
//COMMENTS ROUTES
//=====================

//NEW - FORM
router.get("/new", isLoggedIn, function (req, res) {
    //find bikeroute by id
    BikeRouteMod.findById(req.params.id, function (err, foundBikeroute) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { bikeroute: foundBikeroute });
        }
    });
});

//POST -CREATING COMMENT
router.post("/", isLoggedIn, function (req, res) {
    BikeRouteMod.findById(req.params.id, function (err, bikeroute) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            CommentMod.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    bikeroute.comments.push(comment);
                    bikeroute.save();
                    res.redirect("/bikeroutes/" + bikeroute._id);
                }
            })
        }
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;