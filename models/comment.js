var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: "UserMod"//the model that we are going to refer to with this id.
        },
        username: String
    }
}); 

module.exports = mongoose.model("CommentMod", commentSchema);