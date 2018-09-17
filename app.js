var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    BikeRouteMod = require("./models/bikeroute"),
    CommentMod = require("./models/comment"),
    UserMod = require("./models/user"),
    seedDB = require("./seeds");

//ROUTES
var commentRoutes = require("./routes/comments"),
    bikerouteRoutes = require("./routes/bikeroutes"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/bike_routes", {useNewUrlParser: true});//intially creates the DB and subsequently connects to it.
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));



//seedDB(); // DANGER DANGER DANGER =================>> CURRENTLY SET TO DELETE ALL

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

//SHORTENING ROUTES
app.use(indexRoutes);
app.use("/bikeroutes/:id/comments", commentRoutes);
app.use("/bikeroutes", bikerouteRoutes);

app.listen(3000, function () {
    console.log("BikeSite has started!");
});