var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
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
app.use(flash());



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

//Middleware for passing user. this adds currentUser to all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.pleaseLogin = req.flash("pleaseLogin");
    res.locals.loggedOut = req.flash("loggedOut");
    next();
});

//SHORTENING ROUTES
app.use(indexRoutes);
app.use("/bikeroutes/:id/comments", commentRoutes);
app.use("/bikeroutes", bikerouteRoutes);

app.listen(3000, function () {
    console.log("BikeSite has started!");
});