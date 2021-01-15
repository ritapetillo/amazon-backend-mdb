const express = require("express");
const productRouter = express.Router();
const Product = require("../../models/Product");
const validation = require("../../lib/validationMiddleware");
const validSchemas = require("../../lib/validationSchema");
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

// GET /listings/:id
//get a plae by id

productRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.send(product);
  } catch (err) {
    console.log(err);
    const error = new Error("Products not found");
    error.code = 404;
    next(error);
  }
});

// POST /products
//create new product
// productRouter.post('/',validation(validSchemas.productSchema),parser.single('image'))

module.exports = productRouter;
