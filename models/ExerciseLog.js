"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  Users = require("./Users.js");

const ExerciseLog = new Schema(
  {
    userId: { type: String, ref: "Users", required: true, index: true },
    desc: {
      type: String,
      required: true,
      maxlength: [32, "Description must be less than 32 characters"]
    },
    duration: {
      type: Number,
      required: true,
      min: [1, "Duration must be greated than 1"]
    },
    onDate: {
      type: Date,
      get: value => value.toDateString()
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

ExerciseLog.pre("save", function(next) {
  Users.findById(this.userId, function(err, data) {
    if (err) {
      next(err);
    } else if (data == null) {
      next({ status: 400, message: "Unknown userId" });
    }
    next();
  });
});

module.exports = mongoose.model("ExerciseLog", ExerciseLog);
