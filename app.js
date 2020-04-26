//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//connect mondb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true});

// to setup new user database first we need to have a schema which represent the data format and then a UserModel(In sql we called correspondingly tablename)
// schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//userModel
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req,res){
  //generate the salthash password
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
     // Store hash in your password DB.
     const newUser = new User({
       email: req.body.username,
       password:hash
       //password: md5(req.body.password)
     });
        newUser.save(function(err){
          if(err){
            console.log(err);
          } else{
            res.render("secrets");
          }
        });
 });

  // creating a brand new user


});


app.post("/login",function(req, res){
  const userName= req.body.username;
  const password=req.body.password;
//  const password = md5(req.body.password);

  User.findOne({email: userName}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
     if(result === true){
      res.render("secrets");
  }
         });
        //if(foundUser.password === password){

        }
      }

    
  });
});



app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
