"use strict";

const Users = require("../models/Users.js");

//insert new user request
exports.handleUser = (req, res, next) => {
  //insert user into db
  const user = new Users({ name: req.body.username });

  user.save((err, data) => {
    //check for duplicate users and send error if found
    if (err) {
      err.code == 11000
        ? next({ status: 400, message: "Username already used." })
        : next(err);
    } else {
      res.json(data);
    }
  });
};

//get list of registered users
exports.getUsers = (req, res, next) => {
  Users.find({}).exec((err, data) => {
    if (err) {
      console.error(err);
      next(err);
    }
    res.json(data);
  });
};
