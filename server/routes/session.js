var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var encrypt = require('../services/encrypt');
var User = require('../models/user');


// Since we're using sequelize, we need to specify how passport (the auth library)
// serializes and deserializes users. In this case we just save the user.id at the
// serialize step and make a query using that id in the deserialize step to retrieve
// the user object.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    if(err) {
      return done(err, null);
    }else{
      return done(null, user);
    }
  });
});

// Define a local authentication strategy used to authenticate a sequelize user
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var encryptedPassword = encrypt.encryptPassword(password).encryptedPassword;

    User.find({ email: email }, function(err, users){
      var user = users[0];
      if(err) {
        return done(err);
      }else if(!user){
        return done(null, false, { message: 'Unknown user' });
      }else if(encryptedPassword != user.password){
        return done(null, false, { message: 'Invalid password'});
      }else{
        return done(null, user);
      }
    });
  }
));

module.exports = function(app) {
  app.get('/sign-in', function(req, res) {
    res.render('session/sign-in');
  });

  app.get('/sign-up', function(req, res) {
    res.render('session/sign-up.hbs', {user: req.user});
  });

  // Invoking logout() will remove the req.user property and clear the login session (if any).
  // Restfully, this is wrong, this should be a delete request to /session, but for ease of use
  // a lot of people will make this exception. It's much easier for sign out links as a get
  app.get('/sign_out', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // The verify callback for local authentication accepts
  // username and password arguments, which are submitted
  // to the application via a login form.
  app.post('/session', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
  }));

  // End point for returning json data for the session user
  app.get('/session', function(req, res) {
    res.json(req.user || {});
  });

  // Create a new user from the sign_up page
  app.post('/registration', function(req, res) {
    var encryptedPassword = encrypt.encryptPassword(req.body.password).encryptedPassword;
    var user = new User({email: req.body.email, password: encryptedPassword});

    user.save(function(err, user){
      if(err) {
        console.log(err);
        res.render('session/sign-up.hbs', {errors: err});
        return;
      }

      req.login(user, function(err) {
        if(err) {
          console.log(err);
          res.render('session/sign-up.hbs', {errors: err});
        }else{
          res.redirect('/');
        }
      });
    });
  });
};