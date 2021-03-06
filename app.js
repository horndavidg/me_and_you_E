var express = require("express"),
app = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
session = require("cookie-session"),
methodOverride = require('method-override'),
morgan = require("morgan"),
favicon = require('serve-favicon');
loginMiddleware = require("./middleware/loginHelper");
routeMiddleware = require("./middleware/routeHelper");

require('dotenv').load();
// Loads .env file in root directory that contains API keys
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
// Passport used for Oauth and includes the Facebook Oauth Strategy for logging in via FB
var request = require('request');
// Used for making API requests
var db = require("./models");
// Connects Mongoose that then connects to the MongoDB


// MIDDLEWARE // ****************************************


app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(loginMiddleware);


app.use(session({
  maxAge: 3600000,
  // sets timeout
  secret: 'citybythebay',
  // how the session decrypts the cookie
  name: "chocolate chip yum"
  // (cookie specific)
}));

// GLOBAL VARIABLES //
var currentuser;


//******************* ENTRY ROUTES ***********************//


app.get('/', function(req,res){
  res.render("static_pages/welcome", {currentuser:currentuser});
});










//******************* AUTH ROUTES ***********************//


// DIRECTED TO THE LOGIN PAGE //

app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  var clear = "";
  res.render("users/login", {err:clear, currentuser:currentuser});
});

// DIRECTED TO THE SIGNUP PAGE //

app.get("/signup", routeMiddleware.preventLoginSignup, function (req, res) {
  var clear = "";
  res.render("users/signup", {err:clear, currentuser:currentuser});
});

// USER SUBMITTS SIGN UP FORM! // 

app.post("/signup", function (req,res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/rads");
    } else if (err){
      
      var error = "Please GO BACK and make sure all the required fields are filled";
       // ERROR HANDLING - SEE VIEWS AND MODELS FILES
      res.render("users/signup", {err:error});

   }
  });
});


// USER SUBMITTS LOGIN FORM! //

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/rads");
    } else {
      
      // ERROR HANDLING - SEE VIEWS AND MODELS FILES
      res.render("users/login", {err:err});
    }
  });
});

// LOGS OUT USER! //

app.get("/logout", function (req, res) {
  req.logout();
  currentuser = null;
  res.redirect("/");
});

//******************* RAD ROUTES ***********************//


app.get('/rads', routeMiddleware.ensureLoggedIn, function (req, res) {
  var clear = "";
  db.User.findById(req.session.id, function(err,user){
          currentuser = user;
  res.render("rads", {err:clear, currentuser:currentuser});
  });
});


//******************* USER ROUTES ***********************//


app.get('/users/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.User.findById(req.params.id, function (err, user) {
      if(err) {
        res.render("errors/404");
      } else {
        res.render("users/show", {user:user, currentuser:currentuser});
      } 
    });
});




























































// ********************************************************


// CATCH ALL //
app.get('*', function(req,res){
  res.render('errors/404');
});

// START SERVER //
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening on Port: 3000");
});