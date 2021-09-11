const express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  WolkeneisStrategy = require('../lib').Strategy,
  app = express();

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

var scope = 'identify';

passport.use(new WolkeneisStrategy({
  clientID: 'clientId',
  clientSecret: 'clientSecret',
  callbackURL: 'http://localhost:5000/authenticate/callback',
  scope: scope
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);
  });
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/authenticate', passport.authenticate('wolkeneis', {
  scope: scope,
}));

app.get('/authenticate/callback', passport.authenticate('wolkeneis', {
  failureRedirect: '/',
  successReturnToOrRedirect: '/userinfo', // Successful auth
}));

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/profile', checkAuth, function (req, res) {
  res.json(req.user);
});


function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send('not logged in :(');
}


app.listen(5000, function (error) {
  if (error) {
    return console.log(error);
  }
  console.log('Listening at http://localhost:5000/');
  console.log('');
  console.log('try http://localhost:5000/authenticate to login');
  console.log('or http://localhost:5000/profile to show your profile');
})