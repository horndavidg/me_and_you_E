  var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     // currentuser = null;
     // err = "Please Login to Continue";
     // res.render('users/login', {err:err, currentuser:currentuser});
     res.redirect('/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.Rad.findById(req.params.id, function(err,rad){
      if (place.ownerId !== req.session.id) {
        res.redirect('/');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/rads');
    }
    else {
     return next();
    }
  }
};



module.exports = routeHelpers;