var express = require("express");
var user = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const isEmail = (email) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

user.post("/register", async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const newuser = {
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    username: req.body.username,
  };
  if (!isEmail(newuser.email)) {
    return res.status(400).json({ message: "Invalid" });
  }
  if (password.trim().length < 8) {
    return res
      .status(400)
      .json({ message: "password should be greater then 8" });
  }
  if (password != confirmPassword) {
    return res
      .status(400)
      .json({ message: "password and confirm password does not match" });
  }
  if (newuser.phoneNumber.trim().length < 10) {
    return res.status(400).json({
      message: "Invalid phone number number should be greater then 10 digit",
    });
  }
  if (newuser.username.trim().length < 3) {
    return res
      .status(400)
      .json({ message: "username shuould be greater then 3" });
  }

  // console.log(db);
  let tenant = await User.findOne({ email: newuser.email });
  // console.log(tenant);
  if (tenant != null) {
    return res.json({ message: "user already exist" });
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(req.body.password, salt);
    })
    .then(async (hash) => {
      const user = new User({ ...newuser, password: hash });
      const newUser = await user.save();
      // console.log(newUser);
      let payload = {
        subject: newUser._id,
      };
      let token = jwt.sign(payload, "aniket");
      // console.log(token);
      res.send({ success: true, token });
    })
    .catch((err) => {
      res.send({ success: false, message: err.message });
    });
});

user.post("/login", async (req, res) => {
  bcrypt
    .hash(req.body.password, saltRounds)
    .then(async (hash) => {
      let user = await User.findOne({ email: req.body.email });
      if (user == "null") {
        return res.json({ message: "user deoes not exist" });
      } else {
        bcrypt.compare(req.body.password, user.password).then((result) => {
          if (result) {
            let payload = {
              subject: user._id,
            };
            let token = jwt.sign(payload, "aniket");
            // console.log(token);
            res.send({ success: true, token });
          } else {
            res.json({ message: "password is incorrect" });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = user;
