"use strict";

const ExerciseLogs = require("../models/ExerciseLog.js");
const Users = require("../models/Users.js");
/* function to add execise entry to db */
exports.logExercise = (req, res, next) => {
  const logEntry = new ExerciseLogs({
    userId: req.body.userId,
    desc: req.body.description,
    duration: req.body.duration,
    onDate: new Date(!req.body.date ? Date.now() : req.body.date).setHours(
      0,
      0,
      0,
      0
    )
  });

  logEntry.save(function(err, data) {
    if (err) {
      next(err);
    } else {
      data.populate("userId", "name", (err, data) => {
        if (err) {
          next(err);
        } else {
          data = data.toJSON();
          delete data.__v;
          delete data._id;
          data.name = data.userId.name;
          data.userId = data.userId._id;
          res.json(data);
        }
      });
    }
  });
};
/* function to get exercise logs */
exports.getLog = (req, res, next) => {
  let response = {};
  let limit = parseInt(req.query.limit);
  if (Number.isNaN(limit)) limit = 0;
  let dateRange = {};
  if (req.query.from) dateRange.$gte = new Date(req.query.from);
  if (req.query.to) dateRange.$lte = new Date(req.query.to);
  //get user
  Users.findById(req.query.userId)
    .select("-__v")
    .exec((err, user) => {
      if (err) {
        next(err);
      } else if (!user) {
        next({ status: 400, message: "Unknown userId" });
        return;
      } else {
        response = user.toObject();
        //get logs
        let query = ExerciseLogs.find({ userId: req.query.userId })
          .sort("onDate")
          .select("-_id -__v -userId")
          .limit(limit);
        if (Object.keys(dateRange).length > 0) {
          query = query.where({ onDate: dateRange });
        }
        query.exec((err, data) => {
          if (err) {
            next(err);
          } else {
            response.count = data.length;
            response.logs = data;
            res.json(response);
          }
        });
      }
    });
};
