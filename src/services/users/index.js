const express = require("express");
const User = require("../../models/User");
const Product = require("../../models/Product")
const validation = require("../../lib/validationMiddleware");
const schemas = require("../../lib/validationSchema");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("../../lib/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "users",
    //   format: async (req, file) => 'png', // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
  },
});

const parser = multer({ storage: storage });

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    const error = new Error("there is a probelm finding users");
    error.httpStatus = 404;
    next(error);
  }
});


userRouter.post("/", validation(schemas.userSchema), async (req, res, next) => {

  try {
    //check if there is already a user with that email
    const user = await User.findOne({ email: req.body.email });
    if (user) return next(new Error("User already existing"));
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password,
    });
    await newUser.save();
    res.send(newUser);
  } catch (err) {
    console.log(err);
    const error = new Error("It was not possible to create a new user");
    error.code = 400;
    next(error);
  }
});

userRouter.post("/:id/add-to-cart/:productId",async(req,res,next)=>{
    try {
        const productID = req.params.productId
        const product = await Product.findById(productID)
        if(product){
            const newProduct = {...product.toObject(),quantity:req.body.quantity}
            console.log(newProduct)
            const isProductThere = await User.findProductInCart(
                req.params.id,
                req.params.productId
            )
            if(isProductThere){
                await User.incrementCartQuantity(
                    req.params.id,
                    req.params.productId,
                    req.body.quantity
                )
                res.send("Quantinty incremendted")
            }else{
            await User.addProductToCart(req.params.id,newProduct)
            res.send("New Product Added to cart")
        }
        }
        
    } catch (error) {
        next(error)
    }
})

userRouter.get("/:id/calculate-cart-total", async (req, res, next) => {
    try {
      const total = await User.calculateCartTotal(req.params.id)
      res.send({ total })
    } catch (error) {
      next(error)
    }
  })



module.exports = userRouter;
