var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    BikeRouteMod = require("./models/bikeroute"),
    CommentMod = require("./models/comment"),
    UserMod = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/bike_routes", {useNewUrlParser: true});//intially creates the DB and subsequently connects to it.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");


seedDB();

//PASSPORT CONFIGURATION    
app.use(require("express-session")({
    secret: "Ish Shadei Dreiru",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserMod.authenticate()));
passport.serializeUser(UserMod.serializeUser());
passport.deserializeUser(UserMod.deserializeUser());

//Middleware for passing user.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function (req, res) {
    res.render("landing");    
});


//INDEX - 
app.get("/bikeroutes", function (req, res) {
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
app.post("/bikeroutes", function (req, res) {
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
app.get("/bikeroutes/new", function (req, res) {
    res.render("bikeroutes/new");
});

//SHOW -  show information about one bike route
app.get("/bikeroutes/:id", function (req, res) {
    BikeRouteMod.findById(req.params.id).populate("comments").exec(function (err, foundBikeRoute) {
        if (err) {
            console.log(err);
        } else {
            res.render("bikeroutes/show", { bikeroute: foundBikeRoute });
        }
    });
});

//=====================
//COMMENTS ROUTES
//=====================

//NEW
app.get("/bikeroutes/:id/comments/new", isLoggedIn, function (req, res) {
    //find bikeroute by id
    BikeRouteMod.findById(req.params.id, function (err, foundBikeroute) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { bikeroute: foundBikeroute });
        }
    });
});

//POST
app.post("/bikeroutes/:id/comments", isLoggedIn, function (req, res) {
    BikeRouteMod.findById(req.params.id, function (err, bikeroute) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            CommentMod.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    bikeroute.comments.push(comment);
                    bikeroute.save();
                    res.redirect("/bikeroutes/" + bikeroute._id);
                }
            })
        }
    });
});

//==============
//AUTH ROUTES
//==============

//show registering form
app.get("/register", function (req, res) {
    res.render("register");
});

//Signing up.
app.post("/register", function (req, res) {
    var newUser = new UserMod({ username: req.body.username });
    UserMod.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/bikeroutes");
        });
    });
});

//Show Login Form
app.get("/login", function (req, res) {
    res.render("login");
});

//Logging in (POST)
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/bikeroutes",
        failureRedirect: "/login"
    }), function (req, res) {

});

//Logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/bikeroutes");
});


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function () {
    console.log("BikeSite has started!");
});