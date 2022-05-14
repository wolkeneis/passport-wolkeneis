[![CodeFactor](https://www.codefactor.io/repository/github/wolkeneis/passport-wolkeneis/badge)](https://www.codefactor.io/repository/github/wolkeneis/passport-wolkeneis)

# passport-wolkeneis

[Passport](http://passportjs.org/) strategy for authenticating with [Wolkeneis](https://wolkeneis.dev/)
using the OAuth 2.0 API.

This module lets you authenticate using Wolkeneis in your Node.js applications.
By plugging into Passport, Wolkeneis authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install
`npm install passport-wolkeneis`

## Usage

#### Create an Application

Before using `passport-wolkeneis`, you must register an application with Wolkeneis.
If you have not already done so, a new application can be created at
[Wolkeneis Account Management](https://moos.wolkeneis.dev/profile).  Your application
will be issued a Client Identifier and Client Secret, which
need to be provided to the strategy.  You will also need to configure a callback
URL which matches the route in your application.

#### Configure Strategy
The Wolkeneis authentication strategy authenticates users via a Wolkeneis user account and OAuth 2.0 token(s). A Wolkeneis API client ID, secret and redirect URL must be supplied when using this strategy. The strategy also requires a `verify` callback, which receives the access token and an optional refresh token, as well as a `profile` which contains the authenticated Wolkeneis user's profile. The `verify` callback must also call `done` providing a user to complete the authentication.

```javascript
var WolkeneisStrategy = require('passport-wolkeneis').Strategy;

var scope = 'identify';

passport.use(new WolkeneisStrategy({
  clientID: 'id',
  clientSecret: 'secret',
  callbackURL: 'https://www.example.com/authenticate/wolkeneis/callback',
  scope: scope
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ wolkeneisUserId: profile.id }, function(error, user) {
    return done(error, user);
  });
}));
```

#### Authenticate Requests
Use `passport.authenticate()`, and specify the `'wolkeneis'` strategy to authenticate requests.

For example, as a route middleware in an [Express](http://expressjs.com/) app:

```javascript
app.get('/authenticate/wolkeneis', passport.authenticate('wolkeneis'));
app.get('/authenticate/wolkeneis/callback', passport.authenticate('wolkeneis', {
  failureRedirect: '/',
}), function(req, res) {
  res.redirect('/secretstuff') // Successful auth
});
```
or
```javascript
app.get('/authenticate/wolkeneis', passport.authenticate('wolkeneis'));
app.get('/authenticate/wolkeneis/callback', passport.authenticate('wolkeneis', {
  failureRedirect: '/',
  successReturnToOrRedirect: '/secretstuff', // Successful auth
}));
```

## Examples
An Express server example can be found in the `/example` directory. Be sure to `npm install` in that directory to get the dependencies.

## Credits
* Nicholas Tay - used passport-discord as a base.
* Jared Hanson - used passport-oauth2, passport-twitter and passport-facebook to understand Passport Strategies better.

## License
Licensed under the ISC license. The full license text can be found in the root of the project repository.
