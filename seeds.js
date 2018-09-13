var mongoose = require("mongoose");
var BikeRouteMod = require("./models/bikeroute");

var data = [
    {
        title: "Niagara Route",
        image: "/images/biketrip.jpg",
        description: "This was an exphausting but exhilarating adventure with many exuberant locations along the route.",
        author: "Nisitha"
    },
    { 
        title: "Finch Corridor Trail", 
        image: "/images/Branch.jpg",
        description: "The finch corridor trail is home to beautiful grassfields and is one of my personal favorites during the summer. It is well paved for a long stretch and is quite uninhabited by humans so you can cruise along at a decent speed with the wind in your hair while doing the Titanic pose.",    
        author: "Makroo" },
    { 
        title: "Harbour Front Trail", 
        image: "/images/windmill.jpg",
        description: "This is one of the most famous trails for Torontonians for it's beautiful view of the Toronto harbor and the Centre Islands. Can be very crowded on weekends.", 
        author: "Nisitha" },
    { 
        title: "Trip to Yelow Knife", 
        image: "/images/YellowKnife.jpg", 
        description: "The coldest route I have ever taken. Biked only for about a 1km in the snow before giving up and hiking the rest of the way with my brother.",
        author: "Nisitha" 
    }
];

function seedDB(){
    //Remove all campgrounds
    BikeRouteMod.remove({}, function(err,removed){
        if(err){
            console.log(err);
        }else{
            console.log("removed");
        }
    });
    //Add campgrounds
    data.forEach(function(seed){
        BikeRouteMod.create(seed, function(err, data){
            if(err){
                console.log(err);
            }else{
                console.log("adding a campground");
            }
        });

    });
}

module.exports = seedDB;







