var express = require("express");
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/bike_routes");//intially creates the DB and subsequently connects to it.
app.use(bodyParser.urlencoded({extended: true}));
app.use( express.static( "public" ) );

app.set("view engine", "ejs");

//Schema Setup
var bikeRoutesSchema = new mongoose.Schema({
    title: String,
    image: String,
    author: String,
    description: String
});

var BikeRouteMod = mongoose.model("BikeRoute", bikeRoutesSchema);//creates the model from the schema

app.get("/", function(req, res){
    res.render("landing");
});

// BikeRouteMod.create(
//     {
//         title: "Niagara Route", 
//         image: "/images/biketrip.jpg", 
//         author: "Nisitha",
//         description: "We travelled from Toronto to Niagara on bike!"    
//     }, function(err, bikeroutes){
//         if(err){
//             console.log(err);
//         }else{
//            console.log("created");
//         }
//     });
// var bikeroutes = [
//     {title: "Niagara Route", image: "/images/biketrip.jpg", author: "Nisitha"},
//     {title: "Winter Biking", image: "/images/Branch.jpg", author: "Makroo"},
//     {title: "Harbour Front Trail", image: "/images/windmill.jpg", author: "Nisitha"},
//     {title: "Trip to Yelow Knife", image: "/images/YellowKnife.jpg", author: "Nisitha"}
// ];

//INDEX - 
app.get("/bikeroutes", function(req, res){  
    //Get BikeRoutes from the Database
    BikeRouteMod.find({}, function(err, allBikeroutes){
        if(err){
            console.log(err);
        }else{
            res.render("index", {bikeroutes: allBikeroutes});
        }
    });
    //res.render ("bikeroutes", {bikeroutes: bikeroutes});
});

//CREATE - add new to DB
app.post("/bikeroutes", function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var author=req.body.author;
    var description = req.body.description;
    var newBikeRoute = {title: title, image: image,description:description, author: author}
    //Create new Route and add to the DB
    BikeRouteMod.create(newBikeRoute, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            res.redirect("/bikeroutes");
        }
    });
    //bikroutes.push(newBikeRoute);

});

//NEW - show form to create new
app.get("/bikeroutes/new", function(req, res){
    res.render("new");
});

//SHOW -  show information about one bike route
app.get("/bikeroutes/:id", function(req, res){
    BikeRouteMod.findById(req.params.id, function(err, foundBikeRoute){
        if(err){
            console.log(err);
        }else{
            res.render("show", {bikeroute: foundBikeRoute});
        }
    });
});


app.listen(3000, function(){
    console.log("BikeSite has started!");
});