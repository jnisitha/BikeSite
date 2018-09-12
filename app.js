var express = require("express");
var app = express();

app.use( express.static( "public" ) );

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/bikeroutes", function(req, res){
    var bikeroutes = [
        {title: "Niagara Route", image: "/images/biketrip.jpg", author: "Nisitha"},
        {title: "Winter Biking", image: "/images/Branch.jpg", author: "Makroo"},
        {title: "Harbour Front Trail", image: "/images/windmill.jpg", author: "Nisitha"},
        {title: "Trip to Yelow Knife", image: "/images/YellowKnife.jpg", author: "Nisitha"}
    ];
    
    res.render ("bikeroutes", {bikeroutes: bikeroutes});
});

app.listen(3000, function(){
    console.log("BikeSite has started!");
});