/**
 * Dependencies
 */
const OAuth2Strategy = require('passport-oauth2'),
  InternalOAuthError = require('passport-oauth2').InternalOAuthError,
  util = require('util');


/**
 * Options for the Strategy.
 * @typedef {Object} StrategyOptions
 * @property {string} clientID
 * @property {string} clientSecret
 * @property {string} callbackURL
 * @property {Array} scope
 * @property {string} [authorizationURL="https://walderde.wolkeneis.dev/oauth2/authorize"]
 * @property {string} [tokenURL="https://walderde.wolkeneis.dev/oauth2/token"]
 * @property {string} [scopeSeparator=" "]
 */
/**
 * `Strategy` constructor.
 *
 * The Wolkeneis authentication strategy authenticates requests by delegating to
 * Wolkeneis via the OAuth2.0 protocol
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception occured, `error` should be set.
 *
 * Options:
 *   - `clientID`       identifies client to Wolkeneis
 *   - `clientSecret`   secret used to verify ownership of the client
 *   - `callbackURL`    URL thatwWolkeneis will redirect to after auth
 *   - `scope`          permission scope to request
 *                      Check the official documentation for valid scopes to pass.
 * 
 * @constructor
 * @param {StrategyOptions} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://walderde.wolkeneis.dev/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://walderde.wolkeneis.dev/oauth2/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'wolkeneis';
  this._userProfileURL = options.userProfileURL || 'https://walderde.wolkeneis.dev/api/user/profile';
}

/**
 * Inherits from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to Wolkeneis using OAuth2.0.
 *
 * @param {http.IncomingMessage} req
 * @param {object} [options]
 * @access protected
 */
Strategy.prototype.authenticate = function (req, options) {
  // When a user denies authorization on Wolkeneis, they are presented with a link
  // to return to the application in the following format (where xxx is the
  // value of the request token):
  //
  //     http://www.example.com/authenticate/wolkeneis/callback?denied=xxx
  //
  // Following the link back to the application is interpreted as an
  // authentication failure.
  if (req.query && req.query.denied) {
    return this.fail();
  }

  // Call the base class for standard OAuth2.0 authentication.
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};


/**
 * Retrieve user profile from Wolkeneis.
 *
 * This function constructs a normalized profile.
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (error, body) {
    if (error) {
      return done(new InternalOAuthError('Failed to fetch the user profile.', error))
    }

    try {
      var parsedData = JSON.parse(body);
    }
    catch (e) {
      return done(new Error('Failed to parse the user profile.'));
    }

    var profile = parsedData;
    profile.provider = 'wolkeneis';
    profile.fetchedAt = new Date();
    return done(undefined, profile);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
