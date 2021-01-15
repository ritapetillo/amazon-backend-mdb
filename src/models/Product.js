const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
  imageUrl: String,
  price: Number,
  category: String,
  sku: {
    type: String,
    unique: true,
  },
  qt: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  reviews:[{
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },

}],
});


module.exports = mongoose.model("products", ProductSchema);
