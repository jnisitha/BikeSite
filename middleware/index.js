var BikeRouteMod = require("../models/bikeroute");
var CommentMod = require("../models/comment");

var middlewareObj = {};

//FOR CHECKING USER AUTHENTICATION
middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("pleaseLogin", "Please Login to continue");
    res.redirect("/login");
}

//FOR CHECKING AUTHORIZATION FOR BIKE ROUTES
middlewareObj.routeAuthorizationCheck = function (req, res, next){
    if(req.isAuthenticated()){
        BikeRouteMod.findById(req.params.id, function(err, foundBikeRoute){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundBikeRoute.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");                    
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//FOR CHECKING AUTHORIZATION FOR COMMENTS
middlewareObj.commentAuthorizationCheck = function (req, res, next){
    if(req.isAuthenticated()){
        CommentMod.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");                    
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;