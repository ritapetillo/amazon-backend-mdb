const express = require("express");
const productRouter = express.Router();
const Product = require("../../models/Product");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../lib/cloudinary");
//multer settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
  },
});
const parser = multer({ storage });

// GET /products
//get all the products
productRouter.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    console.log(err);
    const error = new Error("Products not found");
    error.code = 404;
    next(error);
  }
});

module.exports = productRouter;
