const {Schema } require("mongoose")
const mongoose = require("mongoose")

const ReviewsSchema = new Schema (
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

module.exports = model("Review",ReviewsSchema)