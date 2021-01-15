const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  cart: { type: Schema.Types.ObjectId, ref: "carts" },
  createdAt: Date,
  updatedAt: Date,
});

// UserSchema.pre("save", async (next) => {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model("users", UserSchema);
