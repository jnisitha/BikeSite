var express = require("express");
var router = express.Router();
var BikeRouteMod = require("../models/bikeroute");

//INDEX - 
router.get("/", function (req, res) {
    //Get BikeRoutes from the Database
    BikeRouteMod.find({}, function (err, allBikeroutes) {
        if (err) {
            console.log(err);
        } else {
            res.render("bikeroutes/index", { bikeroutes: allBikeroutes });
        }
    });
    //res.render ("bikeroutes", {bikeroutes: bikeroutes});
});

//CREATE - add new to DB
router.post("/", function (req, res) {
    var title = req.body.title;
    var image = req.body.image;
    var author = req.body.author;
    var description = req.body.description;
    var newBikeRoute = { title: title, image: image, description: description, author: author }
    //Create new Route and add to the DB
    BikeRouteMod.create(newBikeRoute, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/bikeroutes");
        }
    });
    //bikroutes.push(newBikeRoute);

});

//NEW - show form to create new
router.get("/new", function (req, res) {
    res.render("bikeroutes/new");
});

//SHOW -  show information about one bike route
router.get("/:id", function (req, res) {
    BikeRouteMod.findById(req.params.id).populate("comments").exec(function (err, foundBikeRoute) {
        if (err) {
            console.log(err);
        } else {
            res.render("bikeroutes/show", { bikeroute: foundBikeRoute });
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