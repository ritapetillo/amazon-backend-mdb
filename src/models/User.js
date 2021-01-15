const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../lib/validationSchema");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  cart: [
    {
      total: Number,
      productId: [{ type: Schema.Types.ObjectId, ref: "products" }],
      quantity: Number,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});

// UserSchema.pre("save", async (next) => {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

UserSchema.static("findProductInCart", async function (id, productId) {
  const isProduct = await UserModel.findOne({
    _id: id,
    "cart.productId": productId,
  });
  return isProduct;
});

UserSchema.static(
  "incrementCartQuantity",
  async function (id, productId, quantity) {
    await UserModel.findOneAndUpdate(
      {
        _id: id,
        "cart.productId": productId,
      },
      { $inc: { "cart.$.quantity": quantity } }
    );
  }
);

UserSchema.static("addProductToCart", async function (id, productId) {
  const productToAdd = {
    productId,
  };

  await UserModel.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { cart: productToAdd },
    }
  );
});

UserSchema.static("calculateCartTotal", async function (id) {
  const cart = await UserModel.findById(id).populate([
    {
      path: "cart.product",
    },
  ]);
  console.log(cart, "123----321");
  return cart;
  // .map(product => product.total * product.quantity)
  // .reduce((acc, el) => acc + el, 0)
});
const UserModel = model("users", UserSchema);

module.exports = UserModel;
