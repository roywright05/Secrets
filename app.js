//jshint esversion:6
require("dotenv").config();
const express = require("express");
const port = 6190;
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

console.log(process.env.SECRET + "\n" + process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {

  res.render("home");
});

app.route("/login")
  .get((req, res) => {

    res.render("login");
  })
  .post((req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne( {email: email}, (err, foundUser) => {

      if(err){
        console.log(err);
      }else{

        if(foundUser){

          if(foundUser.password === password){

            res.render("secrets");
          }
        }
      }
    });

  });

app.route("/register")
  .get((req, res) => {

    res.render("register");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({

      email: username,
      password: password
    });

    newUser.save((err) => {

      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });

  });
app.listen(port, () => {

  console.log("Server started on port " + port + ".");
});
