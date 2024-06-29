const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

/* const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    userName: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("User", userSchema); */
