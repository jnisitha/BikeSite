var mongoose = require("mongoose");

//Schema Setup
var bikeRoutesSchema = new mongoose.Schema({
    title: String,
    image: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserMod"
        },
        username: String
    },
    description: String,
    //Referencing the comments.
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentMod"
        }
    ]
});

module.exports = mongoose.model("BikeRouteMod", bikeRoutesSchema);//creates the model from the schema