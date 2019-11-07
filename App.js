const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

const Schema = mongoose.Schema;

const personSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }
});
const personModel = mongoose.model("Person", personSchema);

const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});
const exerciseModel = mongoose.model("Exercise", exerciseSchema);
//add users
let createAndSaveUser = (user, done) => {
  console.log(user);
  let newUser = new personModel({ username: user.username });
  newUser.save((err, data) => {
    if (err) {
      if (err.code == 11000)
        return done({
          status: 400,
          message: "username already taken"
        });
      done(err);
    }

    done(null, data);
  });
};

let getUsers = done => {
  personModel.find({}, (err, data) => {
    if (err) done(err);
    done(null, data);
  });
};

let addExercises = (exercises, done) => {
  personModel.findById({ _id: exercises.userId }, (err, data) => {
    if (err) {
      return done(err);
    }

    
  });
  let newExercise = new exerciseModel({
    userId: exercises.userId,
    description: exercises.description,
    duration: exercises.duration
  });
  if (exercises.date) newExercise.date = exercises.date;
  newExercise.save((err, data) => {
    if (err) done(err);
    done(null, data);
  });
};

let exerciseLog = (id, limit, done) => {
    const limitExercises = parseInt(limit);

let numberOfExercises = {
      count: Number
    };
  
  let logExercises = {username:String
                     };
 
  personModel.findById({ _id: id }, (err, dataPerson) => {
    if (err) return done(err);
    logExercises.id=dataPerson._id;
  logExercises.username=dataPerson.username;
    
  });
    
    exerciseModel.find({ userId: id }, (err, dataExercises) => {
      if (err) return done(err);

      numberOfExercises.count = dataExercises.length;
logExercises.numberOfWorkouts = dataExercises.length;
      
      
       dataExercises = [...dataExercises, logExercises];

      done(null, dataExercises);
    }).limit(limitExercises);
}



exports.exerciseLog = exerciseLog;
exports.createAndSaveUser = createAndSaveUser;
exports.getUsers = getUsers;
exports.addExercises = addExercises;
