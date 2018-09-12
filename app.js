var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use( express.static( "public" ) );

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

var bikeroutes = [
    {title: "Niagara Route", image: "/images/biketrip.jpg", author: "Nisitha"},
    {title: "Winter Biking", image: "/images/Branch.jpg", author: "Makroo"},
    {title: "Harbour Front Trail", image: "/images/windmill.jpg", author: "Nisitha"},
    {title: "Trip to Yelow Knife", image: "/images/YellowKnife.jpg", author: "Nisitha"}
];


app.get("/bikeroutes", function(req, res){    
    res.render ("bikeroutes", {bikeroutes: bikeroutes});
});

app.post("/bikeroutes", function(req, res){
    var name = req.body.title;
    var image = req.body.image;
    var author=req.body.author;
    var newBikeRoute = {title: title, image: image, author: author}
    bikroutes.push(newBikeRoute);

    res.redirect("/bikeroutes");
});

app.get("/bikeroutes/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("BikeSite has started!");
});