var express = require("express");
var router = express.Router({mergeParams: true});//this merges the params defined in bikeroutes.js with the ones here.
var BikeRouteMod = require("../models/bikeroute");
var CommentMod = require("../models/comment");
var middleware = require("../middleware");

//=====================
//COMMENTS ROUTES
//=====================

//NEW - FORM
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
    BikeRouteMod.findById(req.params.id, function (err, bikeroute) {
        if (err) {
            console.log(err);
            res.redirect("/bikeroutes");
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

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.commentAuthorizationCheck, function(req, res){
    CommentMod.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {bikeroute_id: req.params.id, comment: foundComment});            
        }
    })
});

//UPDATE COMMENT
router.put("/:comment_id", middleware.commentAuthorizationCheck, function(req, res){
    CommentMod.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            //res.redirect("back");
        } else {
            res.redirect("/bikeroutes/" + req.params.id);
        }
    })
});

//DELETE COMMENT
router.delete("/:comment_id", middleware.commentAuthorizationCheck, function(req, res){
    CommentMod.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/bikeroutes/" + req.params.id);
        }
    });
});

module.exports = router;