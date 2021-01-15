const express = require("express");
const User = require("../../models/User");
const Product = require("../../models/Product");
const validation = require("../../lib/validationMiddleware");
const schemas = require("../../lib/validationSchema");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const { TOKEN_SECRET } = process.env;
const auth = require("../../lib/privateRoutes");
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
const jwt = require("jsonwebtoken");
const reviewsRouter = require("../reviews");

const parser = multer({ storage: storage });

userRouter.get("/", async (req, res, next) => {
  try {

    const users = await User.find().select({ password: 0 });

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

userRouter.post("/:id/add-to-cart/:productId", async (req, res, next) => {
  try {
    const productID = req.params.productId;
    const product = await Product.findById(productID);
    if (product) {
      const newProduct = { ...product.toObject(), quantity: req.body.quantity };

      const isProductThere = await User.findProductInCart(
        req.params.id,
        req.params.productId
      );
      if (isProductThere) {
        await User.incrementCartQuantity(
          req.params.id,
          req.params.productId,
          req.body.quantity
        );
        res.send("New Product Added :D");
      }
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

//GET /user/me
// Get current user
userRouter.get("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select({ password: 0 });
    res.send(user);
  } catch (err) {
    const error = new Error("there is a problem finding user");
    error.httpStatus = 404;
    next(error);
  }
});

//GET /user/:id
userRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select({ password: 0 });
    res.send(user);
  } catch (err) {
    const error = new Error("there is a problem finding user");
    error.httpStatus = 404;
    next(error);
  }
});

//POST /users/login
//Login the user in
userRouter.post(
  "/login",
  validation(schemas.loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //find the user
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Username or password is wrong");
        error.code = 400;
        next(error);
      }
      const valid = await bcrypt.compare(password, user.password);

      if (valid) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          TOKEN_SECRET
        );
        res.header("auth-token", token).send(token);
        res.send("user logged in");
      }
    } catch (err) {
      const error = new Error("User not found or User/Password don't match");
      error.httpStatus = 404;
      next(error);
    }
  }
);

//PUT /users/:id
//Edit the user by id
userRouter.put(
  "/:id",
  validation(schemas.userSchema),
  async (req, res, next) => {
    try {
      //check if there is already a user with that email

      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(req.body.password, salt);
      const edits = {
        ...req.body,
        password,
        updatedAt: Data.now(),
      };
      const user = await User.findByIdAndUpdate(id, edits, {
        runValidators: true,
        new: true,
      });
      if (!user) return next(new Error("User doesn't exist"));
      res.send(user);
    } catch (err) {
      console.log(err);
      const error = new Error("It was not possible to create a new user");
      error.code = 400;
      next();
    }
  }
);

//DELETE /user/:id
//delete a user by id
userRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.send("user deleted");
  } catch (err) {
    const error = new Error("there is a problem finding user");
    error.httpStatus = 404;
    next(error);
  }
});


module.exports = userRouter;
