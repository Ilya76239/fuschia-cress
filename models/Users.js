"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  shortId = require("shortid");

const Users = new Schema({
  _id: { type: String, default: shortId.generate, unique: true },
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [32, "Name must be less than 32 characters."]
  }
});

module.exports = mongoose.model("Users", Users);
