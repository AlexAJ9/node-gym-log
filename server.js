const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const runApp = require("./App.js");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const mongoose = require("mongoose");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//Save User
let createUser = require("./App.js").createAndSaveUser;
app.post("/api/exercise/new-user", function(req, res, next) {
  console.log(req.body);
  createUser(req.body, (err, data) => {
    if (err) {
      return next(err);
    }

    res.json(data);
  });
});
//Get users
let getUsers = require("./App.js").getUsers;
app.get("/api/exercise/users", function(req, res, next) {
  getUsers((err, data) => {
    if (err) next(err);
    console.log(data);

    // let result = data.map(a => a.username);

    res.json(data);
  });
});
//Add Exercise
let addExercise = require("./App.js").addExercises;
app.post("/api/exercise/add", function(req, res, next) {
  addExercise(req.body, (err, data) => {
    if (err) {
      return next(err);
    }

    res.json(data);
  });
});
//View Logs
let exerciseLog = require("./App.js").exerciseLog;
app.get("/api/exercise/log", function(req, res, next) {
  let id = req.query.id;

  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;

  exerciseLog(id, limit, (err, data) => {
    if (err) return err;
    res.json(data);
  });
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
