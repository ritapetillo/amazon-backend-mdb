const {Schema ,model}= require("mongoose")
const mongoose = require("mongoose")

const ReviewSchema = new Schema (
    {
        comment:{
            type:String,
            required:true,
        },
        rate: {
            type: Number,
            min: 1,
            max: 5,
            default: 1,
          },
    }
)

module.exports = model("Review",ReviewSchema)