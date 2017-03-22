'use strict'

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

/*
Add Schema and Middleware here
 */


//mit
var JokeSchema = new Schema(
    {
        joke: {
            type: String,
            required: true,
            notEmpty: true,
            minlength: 5
        },
        category: [String],
        reference: {
            author: String,
            link: String
        },
        lastEdited: {type: Date, default: Date.now}
    }
)


JokeSchema.pre('save', function(next){
    this.lastEdited = new Date();
    next();
});
//mit

let JokeModel = mongoose.model("Joke", JokeSchema);
module.exports = JokeModel;
