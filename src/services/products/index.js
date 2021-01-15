const express = require("express");
const productRouter = express.Router();
const mongoose = require("mongoose")
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

// GET /products/:id
//get a product by id


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
// create new product
productRouter.post(
  "/",
  validation(validSchemas.productSchema),
  async (req, res, next) => {
    try {
      //verify if there is any other product with the same sku
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct)
        return next(new Error("There is already a product with the same SKU"));

      const newProduct = new Product({
        ...req.body,
      });
      const product = await newProduct.save();
      res.send(product);
    } catch (err) {
      console.log(err);
      const error = new Error("It was not possible to create a new product");
      error.code = 404;
      next(error);
    }
  }
);

// PUT /products/:id
// edit an existing product
productRouter.put(
  "/:id",
  validation(validSchemas.productSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const updatedProduct = {
        ...req.body,
        updatedAt: Date.now(),
      };
      //verify if there is any other product with the same sku
      const existingProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { ...updatedProduct } },

        {
          runValidators: true,
          new: true,
        }
      );
      if (!existingProduct) return next(new Error("Product not found"));
      res.send(existingProduct);
    } catch (err) {
      console.log(err);

      const error = new Error("It was not possible to edit the product");

      error.code = 404;
      next(error);
    }
  }
);



//DELETE /product/:id
//delete a product by id

productRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.send(`${product._id} has been deleted`);
  } catch (err) {
    console.log(err);
    const error = new Error("Products not found");
    error.code = 404;
    next(error);
  }
});

//POST /product/:id/image
//upload product image
productRouter.post(
  "/:id/image",
  parser.single("image"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const imageUrl = req.file && req.file.path; // add the single
      //verify if there is any other product with the same sku
      const existingProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { imageUrl } },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!existingProduct) return next(new Error("Product not found"));
      res.send(existingProduct);
    } catch (err) {
      console.log(err);
      const error = new Error("It was not possible to edit the product");
      error.code = 404;
      next(error);
    }
  }
);


// ============================== REVIEWS CRUD -================================================
productRouter.post("/:id", async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: { ...req.body }, //,_id:mongoose.Types.ObjectId()
        },
      },
      { new: true }
    );
    // const { _id} = await updated.save()
    res.status(201).send(updated);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reviews } = await Product.findById(id, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:id/reviews/:reviewsID", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reviews } = await Product.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewsID) },
        },
      }
    );
    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:id/reviews/:reviewsID" ,async(req,res,next)=>{
    try {
        const {reviews}= await Product.findOne(
            {_id:mongoose.Types.ObjectId(req.params.id)},
            {
                _id:0,
                reviews:{
                    $elemMatch: {_id:mongoose.Types.ObjectId(req.params.reviewsID)},
                },
            }
        )
        if(reviews && reviews.length>0){
            const updatedReview = {...reviews[0].toObject(), ...req.body}

            const modifiedReview = await Product.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                    "reviews._id":mongoose.Types.ObjectId(req.params.reviewsID)
                },
                {$set : {"reviews.$":updatedReview}},
                {
                    new:true,
                }
                
            )
            res.send(modifiedReview)
        }else{
            next()
        }
    } catch (error) {
        next(error)
    }
})

productRouter.delete("/:id/reviews/:reviewsID", async(req,res,next)=>{
    try {
        const modifiedReview = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    reviews : {_id:mongoose.Types.ObjectId(req.params.reviewsID)},
                },
            },
            {
                new:true
            }
        )
        res.send("Deleted")
    } catch (error) {
        next(error)
    }
})

module.exports = productRouter;
