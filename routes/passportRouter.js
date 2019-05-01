const express = require('express');
const passportRouter = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// Require user model
const User = require('../models/user');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// GET  '/login'
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

// POST  '/login'
passportRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    passReqToCallback: true
  })
);

// GET  '/signup'
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

// POST  '/signup'
passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('passport/signup', {
      message: 'Indicate username and password'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('passport/signup', {
          message: 'The username already exists'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({ username, password: hashPass });

      newUser.save(err => {
        if (err)
          res.render('passport/signup', {
            message: 'Something went wrong'
          });
        else res.redirect('/');
      });
    })
    .catch(error => next(error));
});

//GET  '/logout'
passportRouter.get('/logout', (req, res) => {
  /* Passport exposes a `logout()` method on `req` that can be called
  from any route handler. `req.logout()` deletes the session from the session storage
  and in this way "logs out" the user
  . */
  req.logout();
  res.redirect('/');
});

passportRouter.get(
  '/private',
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render('passport/private', { user: req.user });
  }
);

module.exports = passportRouter;
