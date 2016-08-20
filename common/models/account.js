/*

module.exports = function(Account) {

	var mte = ['login','logout','exists','confirm','resetPassword'];
	ut.disableAllMethodsBut(Account, mte);

	Account.beforeRemoe('login', function(context, userInstance, next) {
		var token = jwt.encode({
		  iss: 'hello'
		}, app.get('jwtTokenSecret'));

		var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

	});
*/
/*!
 * Module Dependencies.
 */

var loopback = require('../../node_modules/loopback/lib/loopback');
var utils = require('../../node_modules/loopback/lib/utils');
var path = require('path');
var SALT_WORK_FACTOR = 10;
var crypto = require('crypto');

var DEFAULT_TTL = 1209600; // 2 weeks in seconds
var DEFAULT_RESET_PW_TTL = 15 * 60; // 15 mins in seconds
var DEFAULT_MAX_TTL = 31556926; // 1 year in seconds
var assert = require('assert');

var config = require('../../server/config.json');
var app = require('../../server/server.js');

var jwt = require('jwt-simple');
var path = require('path');
var ut = require('./methodDisabling');


module.exports = function(Account) {

  Account.prototype.createAccessToken = function(ttl, options, cb) {
		var user = options;
    if (cb === undefined && typeof options === 'function') {
      // createAccessToken(ttl, cb)
      cb = options;
      options = undefined;
    }

    cb = cb || utils.createPromiseCallback();

    if (typeof ttl === 'object' && !options) {
      // createAccessToken(options, cb)
      options = ttl;
      ttl = options.ttl;
    }
    options = options || {};
    var userModel = this.constructor;
    ttl = Math.min(ttl || userModel.settings.ttl, userModel.settings.maxTTL);
		var token = jwt.encode({
		  email: user.email,
			company: user.companyId,
			duty: user.dutyId
		}, app.get('jwtTokenSecret'));
    this.accessTokens.create({
			id: token,
      ttl: ttl
    }, cb);

		var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
		console.log(decoded);
    return cb.promise;
  };

  Account.normalizeCredentials = function(credentials) {
    var query = {};
    credentials = credentials || {};
      if (credentials.email) {
        query.email = credentials.email;
      } else if (credentials.username) {
        query.username = credentials.username;
      }
    return query;
  };

  Account.login = function(credentials, include, fn) {
    var self = this;
    if (typeof include === 'function') {
      fn = include;
      include = undefined;
    }

    fn = fn || utils.createPromiseCallback();

    include = (include || '');
    if (Array.isArray(include)) {
      include = include.map(function(val) {
        return val.toLowerCase();
      });
    } else {
      include = include.toLowerCase();
    }

    var query = self.normalizeCredentials(credentials);
    if (!query.email && !query.username) {
      var err2 = new Error('username or email is required');
      err2.statusCode = 400;
      err2.code = 'USERNAME_EMAIL_REQUIRED';
      fn(err2);
      return fn.promise;
    }

    self.findOne({where: query}, function(err, user) {
      var defaultError = new Error('login failed');
      defaultError.statusCode = 401;
      defaultError.code = 'LOGIN_FAILED';

      function tokenHandler(err, token) {
        if (err) return fn(err);
        if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
          token.__data.user = user;
        }
        fn(err, token);
      }

      if (err) {
        console.log('An error is reported from User.findOne: %j', err);
        fn(defaultError);
      } else if (user) {
        user.hasPassword(credentials.password, function(err, isMatch) {
          if (err) {
            console.log('An error is reported from User.hasPassword: %j', err);
            fn(defaultError);
          } else if (isMatch) {
            if (self.settings.emailVerificationRequired && !user.emailVerified) {
              // Fail to log in if email verification is not done yet
              console.log('User email has not been verified');
              err = new Error('login failed as the email has not been verified');
              err.statusCode = 401;
              err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
              fn(err);
            } else {
              if (user.createAccessToken.length === 2) {
                user.createAccessToken(credentials.ttl, tokenHandler);
              } else {
                user.createAccessToken(credentials.ttl, user, tokenHandler);
              }
            }
          } else {
						console.log(user);
            console.log('The password is invalid for user %s', user.email || user.username);
            fn(defaultError);
          }
        });
      } else {
        console.log('No matching record is found for user %s', query.email || query.username);
        fn(defaultError);
      }
    });
    return fn.promise;
  };

  Account.logout = function(tokenId, fn) {
    fn = fn || utils.createPromiseCallback();
    this.relations.accessTokens.modelTo.findById(tokenId, function(err, accessToken) {
      if (err) {
        fn(err);
      } else if (accessToken) {
        accessToken.destroy(fn);
      } else {
        fn(new Error('could not find accessToken'));
      }
    });
    return fn.promise;
  };

  Account.prototype.hasPassword = function(plain, fn) {
    fn = fn || utils.createPromiseCallback();
    if (this.password && plain) {
      fn(null, this.password == plain);
    } else {
      fn(null, false);
    }
    return fn.promise;
  };

  Account.prototype.verify = function(options, fn) {
    fn = fn || utils.createPromiseCallback();

    var user = this;
    var userModel = this.constructor;
    var registry = userModel.registry;
    assert(typeof options === 'object', 'options required when calling user.verify()');
    assert(options.type, 'You must supply a verification type (options.type)');
    assert(options.type === 'email', 'Unsupported verification type');
    assert(options.to || this.email, 'Must include options.to when calling user.verify() or the user must have an email property');
    assert(options.from, 'Must include options.from when calling user.verify()');

    options.redirect = options.redirect || '/';
    options.template = path.resolve(options.template || path.join(__dirname, '..', '..', 'templates', 'verify.ejs'));
    options.user = this;
    options.protocol = options.protocol || 'http';

    var app = userModel.app;
    console.log(app);
    options.host = options.host || (app && app.get('host')) || 'localhost';
    options.port = options.port || (app && app.get('port')) || 3000;
    options.restApiRoot = options.restApiRoot || (app && app.get('restApiRoot')) || '/api';

    var displayPort = (
      (options.protocol === 'http' && options.port == '80') ||
      (options.protocol === 'https' && options.port == '443')
    ) ? '' : ':' + options.port;

    options.verifyHref = options.verifyHref ||
      options.protocol +
      '://' +
      options.host +
      displayPort +
      options.restApiRoot +
      userModel.http.path +
      userModel.sharedClass.find('confirm', true).http.path +
      '?uid=' +
      options.user.id +
      '&redirect=' +
      options.redirect;

    // Email model
    var Email = options.mailer || this.constructor.email || registry.getModelByType(loopback.Email);

    // Set a default token generation function if one is not provided
    var tokenGenerator = options.generateVerificationToken || Account.generateVerificationToken;

    tokenGenerator(user, function(err, token) {
      if (err) { return fn(err); }

      user.verificationToken = token;
      user.save(function(err) {
        if (err) {
          fn(err);
        } else {
          sendEmail(user);
        }
      });
    });

    // TODO - support more verification types
    function sendEmail(user) {
      options.verifyHref += '&token=' + user.verificationToken;

      options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}';

      options.text = options.text.replace('{href}', options.verifyHref);

      options.to = options.to || user.email;

      options.subject = options.subject || 'Thanks for Registering';

      options.headers = options.headers || {};

      //var template = loopback.template(options.template);
      //options.html = template(options);
      console.log('BOOOOOOOM');
      Email.send(options, function(err, email) {
        if (err) {
          fn(err);
        } else {
          fn(null, {email: email, token: user.verificationToken, uid: user.id});
        }
      });
    }
    return fn.promise;
  };


  Account.generateVerificationToken = function(user, cb) {
    crypto.randomBytes(64, function(err, buf) {
      cb(err, buf && buf.toString('hex'));
    });
  };


  Account.confirm = function(uid, token, redirect, fn) {
    fn = fn || utils.createPromiseCallback();
    this.findById(uid, function(err, user) {
      if (err) {
        fn(err);
      } else {
        if (user && user.verificationToken === token) {
          user.verificationToken = undefined;
          user.emailVerified = true;
          user.save(function(err) {
            if (err) {
              fn(err);
            } else {
              fn();
            }
          });
        } else {
          if (user) {
            err = new Error('Invalid token: ' + token);
            err.statusCode = 400;
            err.code = 'INVALID_TOKEN';
          } else {
            err = new Error('User not found: ' + uid);
            err.statusCode = 404;
            err.code = 'USER_NOT_FOUND';
          }
          fn(err);
        }
      }
    });
    return fn.promise;
  };


  Account.resetPassword = function(options, cb) {
    cb = cb || utils.createPromiseCallback();
    var UserModel = this;
    var ttl = UserModel.settings.resetPasswordTokenTTL || DEFAULT_RESET_PW_TTL;

    options = options || {};
    if (typeof options.email !== 'string') {
      var err = new Error('Email is required');
      err.statusCode = 400;
      err.code = 'EMAIL_REQUIRED';
      cb(err);
      return cb.promise;
    }

    UserModel.findOne({ where: {email: options.email} }, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        err = new Error('Email not found');
        err.statusCode = 404;
        err.code = 'EMAIL_NOT_FOUND';
        return cb(err);
      }
      // create a short lived access token for temp login to change password
      // TODO(ritch) - eventually this should only allow password change
      user.accessTokens.create({ttl: ttl}, function(err, accessToken) {
        if (err) {
          return cb(err);
        }
        cb();
        UserModel.emit('resetPasswordRequest', {
          email: options.email,
          accessToken: accessToken,
          user: user
        });
      });
    });

    return cb.promise;
  };


  Account.hashPassword = function(plain) {
    this.validatePassword(plain);
    return plain;
  };

  Account.validatePassword = function(plain) {
    if (typeof plain === 'string' && plain) {
      return true;
    }
    var err =  new Error('Invalid password: ' + plain);
    err.statusCode = 422;
    throw err;
  };

  Account.setup = function() {
    // We need to call the base class's setup method
    Account.base.setup.call(this);
    var UserModel = this;

    // max ttl
    this.settings.maxTTL = this.settings.maxTTL || DEFAULT_MAX_TTL;
    this.settings.ttl = this.settings.ttl || DEFAULT_TTL;

    UserModel.setter.email = function(value) {
      if (!UserModel.settings.caseSensitiveEmail) {
        this.$email = value.toLowerCase();
      } else {
        this.$email = value;
      }
    };

    UserModel.setter.password = function(plain) {
      if (typeof plain !== 'string') {
        return;
      }
      if (plain.indexOf('$2a$') === 0 && plain.length === 60) {
        // The password is already hashed. It can be the case
        // when the instance is loaded from DB
        this.$password = plain;
      } else {
        this.$password = this.constructor.hashPassword(plain);
      }
    };

    // Access token to normalize email credentials
    UserModel.observe('access', function normalizeEmailCase(ctx, next) {
      if (!ctx.Model.settings.caseSensitiveEmail && ctx.query.where && ctx.query.where.email) {
        ctx.query.where.email = ctx.query.where.email.toLowerCase();
      }
      next();
    });

    // Make sure emailVerified is not set by creation
    UserModel.beforeRemote('create', function(ctx, user, next) {
      var body = ctx.req.body;
      if (body && body.emailVerified) {
        body.emailVerified = false;
      }
      next();
    });

    UserModel.remoteMethod(
      'login',
      {
        description: 'Login a user with username/email and password.',
        accepts: [
          {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
          {arg: 'include', type: ['string'], http: {source: 'query' },
            description: 'Related objects to include in the response. ' +
            'See the description of return value for more details.'}
        ],
        returns: {
          arg: 'accessToken', type: 'object', root: true,
          description:
            'The response body contains properties of the AccessToken created on login.\n' +
            'Depending on the value of `include` parameter, the body may contain ' +
            'additional properties:\n\n' +
            '  - `user` - `{User}` - Data of the currently logged in user. (`include=user`)\n\n'
        },
        http: {verb: 'post'}
      }
    );

    UserModel.remoteMethod(
      'logout',
      {
        description: 'Logout a user with access token.',
        accepts: [
          {arg: 'access_token', type: 'string', required: true, http: function(ctx) {
            var req = ctx && ctx.req;
            var accessToken = req && req.accessToken;
            var tokenID = accessToken && accessToken.id;

            return tokenID;
          }, description: 'Do not supply this argument, it is automatically extracted ' +
            'from request headers.'
          }
        ],
        http: {verb: 'all'}
      }
    );

    UserModel.remoteMethod(
      'confirm',
      {
        description: 'Confirm a user registration with email verification token.',
        accepts: [
          {arg: 'uid', type: 'string', required: true},
          {arg: 'token', type: 'string', required: true},
          {arg: 'redirect', type: 'string'}
        ],
        http: {verb: 'get', path: '/confirm'}
      }
    );

    UserModel.remoteMethod(
      'resetPassword',
      {
        description: 'Reset password for a user with email.',
        accepts: [
          {arg: 'options', type: 'object', required: true, http: {source: 'body'}}
        ],
        http: {verb: 'post', path: '/reset'}
      }
    );

    UserModel.afterRemote('confirm', function(ctx, inst, next) {
      if (ctx.args.redirect !== undefined) {
        if (!ctx.res) {
          return next(new Error('The transport does not support HTTP redirects.'));
        }
        ctx.res.location(ctx.args.redirect);
        ctx.res.status(302);
      }
      next();
    });

    // default models
    assert(loopback.Email, 'Email model must be defined before User model');
    UserModel.email = loopback.Email;

    assert(loopback.AccessToken, 'AccessToken model must be defined before User model');
    UserModel.accessToken = loopback.AccessToken;

    // email validation regex
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    UserModel.validatesFormatOf('email', {with: re, message: 'Must provide a valid email'});

    // FIXME: We need to add support for uniqueness of composite keys in juggler
    if (!(UserModel.settings.realmRequired || UserModel.settings.realmDelimiter)) {
      UserModel.validatesUniquenessOf('email', {message: 'Email already exists'});
      UserModel.validatesUniquenessOf('username', {message: 'User already exists'});
    }

    return UserModel;
  };


  Account.setup();

	var mte = ['login','logout','exists','confirm','resetPassword'];
	ut.disableAllMethodsBut(Account, mte);

};
