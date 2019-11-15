"use strict";

const express = require("express"),
  bodyParser = require("body-parser"),
  mongo = require("mongodb"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  parser = bodyParser.urlencoded({ extended: false }),
  app = express(),
  userHandler = require("./controllers/userHandler.js"),
  exerciseLogHandler = require("./controllers/exerciseLogHandler.js");

//connect DB
mongoose
  .connect(process.env.MATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connection to database established."))
  .catch(error => console.error(`DB Connection Error: ${error.message}`));
//enable cors to deal with cross-origin issues
app.use(cors());
//use body parser to parse POST payloads
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

//handle create new user request
app.post("/api/exercise/new-user", userHandler.handleUser);

//handle list of users request
app.get("/api/exercise/users", userHandler.getUsers);

//handle new log entry request
app.post("/api/exercise/add", exerciseLogHandler.logExercise);

//handle log exercise retrieval request
app.get("/api/exercise/log?:userId", exerciseLogHandler.getLog);
//display index.html at root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
