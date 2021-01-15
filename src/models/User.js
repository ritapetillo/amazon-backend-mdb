const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {model} = require("mongoose")
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,

  cart: [
    {
      total: Number,
      product: { type: Schema.Types.ObjectId, ref: "products" },
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
  const isProduct = await UserModel.findOne(
    {
      _id: id,
      "cart._id": productId,
    },
    { $inc: { "cart.$.quantity": quantity } }
  );
});


UserSchema.static(
  "incrementCartQuantity",
  async function (id, productId, quantity) {
    await UserModel.findOneAndUpdate(
      {
        _id: id,
        "cart._id": productId,
      },
      { $inc: { "cart.$.quantity": quantity } }

    )
  }
)

UserSchema.static("addBookToCart", async function (id, product) {
  await UserModel.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { cart: product },
    }

  )
})

UserSchema.static("calculateCartTotal", async function (id) {
  const { cart } = await UserModel.findById(id)
  return cart
    .map(product => product.total * product.quantity)
    .reduce((acc, el) => acc + el, 0)
})
const UserModel = model("users", UserSchema)
module.exports = UserModel

