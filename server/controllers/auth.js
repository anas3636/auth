'use strict'
var db = require("../models");

//**
//*login
//**
const login = (req, res) => {
	res.json(req.user);
}
//**
//*Logout
//**
const logout = (req, res) => {
  req.logOut();
  res.sendStatus(200);
}
//**
//*Logout
//**
const loggedin = (req, res) => {
  res.send(req.isAuthenticated() ? req.user : '0');
}

//**
//*Signup
//*
const signup = (req, res) => {
  db.User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (user) {
      res.json(null);
      return;
    } else {
      var newUser = new db.User();
      newUser.username = req.body.username.toLowerCase();
      newUser.password = newUser.generateHash(req.body.password);
      newUser.save(function(err, user) {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          res.json(user);
        });
      });
    }
  });
}


//Export Module
module.exports = {
	login : login,
	logout : logout,
  loggedin: loggedin,
  signup : signup,
}
