var express = require("express");
var router = express.Router();
var passport = require("passport");
var UserMod = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");    
});


//==============
//AUTH ROUTES
//==============

//show registering form
router.get("/register", function (req, res) {
    res.render("register");
});

//Signing up.
router.post("/register", function (req, res) {
    var newUser = new UserMod({ username: req.body.username });
    UserMod.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Wheelsntrails! " + user.username);
            res.redirect("/bikeroutes");
        });
    });
});

//Show Login Form
router.get("/login", function (req, res) {
    res.render("login");
});

//Logging in (POST)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/bikeroutes",
        failureRedirect: "/login"
    }), function (req, res) {

});

//Logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("loggedOut", "Logged you out!");
    res.redirect("/bikeroutes");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;