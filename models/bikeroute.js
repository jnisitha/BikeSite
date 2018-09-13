var mongoose = require("mongoose");

//Schema Setup
var bikeRoutesSchema = new mongoose.Schema({
    title: String,
    image: String,
    author: String,
    description: String
});

module.exports = mongoose.model("BikeRoute", bikeRoutesSchema);//creates the model from the schema