const express = require("express");
const User = require("../../models/User");
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

userRouter.post("/", async (req, res, next) => {
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

module.exports = userRouter;
